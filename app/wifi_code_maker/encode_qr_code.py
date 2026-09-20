import hashlib
from pathlib import Path

import qrcode


def makeQrCode(text):
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(text)
    qr.make(fit=True)
    image = qr.make_image(fill_color="black", back_color="white")
    output_directory = Path("./persistant/static/img")
    output_directory.mkdir(parents=True, exist_ok=True)
    filename = hashlib.sha256(text.encode("utf-8")).hexdigest()
    qrcode_file_path = output_directory / f"{filename}.png"
    image.save(qrcode_file_path)
    return f"./{qrcode_file_path.as_posix()}"
