-- Creates a base configuration table for webauthn options
-- It links directly to auth.users using auth.uid()

CREATE TABLE public.user_passkeys (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    -- Credential id is the webauthn public key identifier
    credential_id TEXT UNIQUE NOT NULL,
    -- The actual public key used to verify signatures (in base64url or hex)
    public_key TEXT NOT NULL,
    -- How many times this credential has been used (helps prevent cloning)
    counter BIGINT NOT NULL DEFAULT 0,
    -- Tracks the device/browser
    device_type TEXT NOT NULL DEFAULT 'singleDevice',
    -- Set to true if passkey is synced across devices (like iCloud Keychain)
    backed_up BOOLEAN NOT NULL DEFAULT false,
    -- The "transports" the authenticator supports (e.g. ['internal', 'usb'])
    transports TEXT[] DEFAULT '{}',
    name TEXT DEFAULT 'Mi Dispositivo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS policies
ALTER TABLE public.user_passkeys ENABLE ROW LEVEL SECURITY;

-- Users can only read, update, and delete their own passkeys
CREATE POLICY "Users can manage their own passkeys" ON public.user_passkeys
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Also, creating a simple structure to store the "current challenge" 
-- required during the registration/login flow before the passkey is fully verified. 
-- Since challenges expire fast, a small table is fine.
CREATE TABLE public.webauthn_challenges (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    challenge TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Normally RLS restricts users to only manage their own challenge
ALTER TABLE public.webauthn_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own webauthn challenges" ON public.webauthn_challenges
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
