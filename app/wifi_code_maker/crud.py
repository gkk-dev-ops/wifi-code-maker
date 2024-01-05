from sqlalchemy.orm import Session

from . import models, schemas


def get_all_wifis(db: Session):
    return db.query(models.SavedWifiConfig).all()


def create_wifi(db: Session, wifi: schemas.WifiConfig):
    db_wifi = models.SavedWifiConfig(ssid=wifi.ssid, password=wifi.password,
                                     qr_code_url=wifi.qr_code_url)
    db.add(db_wifi)
    db.commit()
    db.refresh(db_wifi)
    return db_wifi


def find_wifi(db: Session, wifi_id: int):
    return db.query(models.SavedWifiConfig).filter(models.SavedWifiConfig.ssid == wifi_id).first()


def remove_wifi(db: Session, wifi_id: int):
    db_wifi = find_wifi(wifi_id=wifi_id, db=db)
    db.delete(db_wifi)
    db.commit()
    return db_wifi
