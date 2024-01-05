from sqlalchemy import Column, String

from .database import Base


class SavedWifiConfig(Base):
    __tablename__ = "saved_wifi_config"

    ssid = Column(String, primary_key=True, unique=True, index=True)
    password = Column(String)
    qr_code_url = Column(String)
