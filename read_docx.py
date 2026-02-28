import zipfile
import xml.etree.ElementTree as ET
import os

def get_docx_text(path):
    """
    Take the path of a docx file as argument, return the text in html/markdown-ish format.
    """
    if not os.path.exists(path):
        return f"File {path} not found."
    
    try:
        with zipfile.ZipFile(path) as z:
            xml_content = z.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            
            # Namespace for docx
            namespace = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            paragraphs = []
            for paragraph in tree.findall('.//w:p', namespace):
                texts = paragraph.findall('.//w:t', namespace)
                if texts:
                    paragraphs.append(''.join([t.text for t in texts]))
            
            return '\n'.join(paragraphs)
    except Exception as e:
        return f"Error reading docx: {str(e)}"

if __name__ == "__main__":
    file_path = "formulario-kick-off.docx"
    print(get_docx_text(file_path))
