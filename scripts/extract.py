import sys
try:
    from PyPDF2 import PdfReader
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "PyPDF2"])
    from PyPDF2 import PdfReader

reader = PdfReader('Sem5.pdf')
text = ''.join(page.extract_text() for page in reader.pages)
with open('temp_sem5.txt', 'w', encoding='utf-8') as f:
    f.write(text)
print("Extracted to temp_sem5.txt")
