from pydantic import BaseModel


class WifiConfig(BaseModel):
    ssid: str
    password: str
    qr_code_url: str

    class Config:
        orm_mode = True


class CreateWifiConfig(BaseModel):
    ssid: str
    password: str
