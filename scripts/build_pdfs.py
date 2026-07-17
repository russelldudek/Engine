from pathlib import Path
chunk_dir = Path(__file__).resolve().parent / 'pdf_chunks'
source = ''.join(path.read_text() for path in sorted(chunk_dir.glob('*.part')))
exec(compile(source, 'combined_pdf_builder.py', 'exec'))
