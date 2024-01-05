import qrcode


def makeQrCode(text):
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(text)
    qr.make(fit=True)
    image = qr.make_image(fill_color="black", back_color="white")
    qrcode_file_path = f"./persistant/static/img/{text}.png"
    image.save(qrcode_file_path)
    return qrcode_file_path
