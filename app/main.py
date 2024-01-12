from fastapi import FastAPI, Depends, HTTPException, Response, Request
from fastapi.responses import FileResponse
from wifi_code_maker.encode_qr_code import makeQrCode
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from sqlalchemy.orm import Session
from wifi_code_maker import crud, models, schemas
from wifi_code_maker.database import SessionLocal, engine

import os
import json


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


models.Base.metadata.create_all(bind=engine)

ssids_deleted_since_last_reboot = []
app = FastAPI()

ALLOWED_ORIGINS = json.loads(os.environ.get("ALLOWED_ORIGINS"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS if ALLOWED_ORIGINS else ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/wifis")
def get_all_wifis(db: Session = Depends(get_db), request: Request = None):
    all_wifis = crud.get_all_wifis(db=db)
    qr_code_host = f"{request.url.scheme}://{request.url.netloc}"
    all_wifis = [ schemas.WifiConfig(ssid=wifi.ssid, password=wifi.password, qr_code_url=f"{qr_code_host}{wifi.qr_code_url[1:]}") for wifi in all_wifis]
    if len(all_wifis) == 0:
        return Response(status_code=204)
    else:
        return all_wifis


@app.delete("/wifi/{wifi_id}")
def remove_wifi(wifi_id: str, db: Session = Depends(get_db)):
    isWifiAvailable = crud.find_wifi(db=db, wifi_id=wifi_id)
    wasRecentlyDeleted = wifi_id in ssids_deleted_since_last_reboot
    if not isWifiAvailable and wasRecentlyDeleted:
        return Response(status_code=204)
    elif not isWifiAvailable and not wasRecentlyDeleted:
        raise HTTPException(
            status_code=404, detail="Wifi with this ssid does not exist")
    else:
        ssids_deleted_since_last_reboot.append(wifi_id)
        return crud.remove_wifi(db=db, wifi_id=wifi_id)


@app.get("/healthcheck")
def healtch():
    return {"status": "ok"}


@app.post("/qrcode")
def read_item(wifi: schemas.CreateWifiConfig, db: Session = Depends(get_db)):
    if (wifi.ssid == None or wifi.password == None):
        raise HTTPException(
            status_code=400, detail="To create wifi both ssid and password must be provided")
    duplicate = crud.find_wifi(db=db, wifi_id=wifi.ssid)
    if (duplicate != None):
        raise HTTPException(
            status_code=409, detail="Wifi with this ssid already exists")
    qrcode_file_path = makeQrCode(
        f"WIFI:S:{wifi.ssid};T:WPA;P:{wifi.password};")
    crud.create_wifi(db=db, wifi=schemas.WifiConfig(
        ssid=wifi.ssid, password=wifi.password, qr_code_url=qrcode_file_path))
    return FileResponse(qrcode_file_path)


app.mount("/persistant/static",
          StaticFiles(directory="persistant/static"), name="static")
app.mount("/", StaticFiles(directory="./frontend/dist", html=True))
