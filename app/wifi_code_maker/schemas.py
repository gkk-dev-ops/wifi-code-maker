from pydantic import BaseModel, ConfigDict


class WifiConfig(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    ssid: str
    password: str
    qr_code_url: str


class CreateWifiConfig(BaseModel):
    ssid: str
    password: str
