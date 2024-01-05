import { useEffect, useState } from "react";
import axios from "axios";
import TrashIcon from "./assets/trash.svg";

type WifiConfig = {
  ssid: string;
  password: string;
  qr_code_url: string;
};

const HOST = import.meta.env.VITE_HOST;
const protocol = "http";
const PORT = import.meta.env.VITE_PORT;
const BASE_URL = `${protocol}://${HOST}:${PORT}`;

function App() {
  const [passwordField, setPasswordField] = useState("");
  const [ssidField, setSsidField] = useState("");
  const [wifis, setWifis] = useState<WifiConfig[]>([]);

  function getWifis() {
    axios.get(`${BASE_URL}/wifis`).then((res) => {
      if (res.status === 204) {
        setWifis([]);
        return;
      } else {
        setWifis(res.data);
      }
    });
  }
  function removeWifi(ssid: string) {
    axios.delete(`${BASE_URL}/wifi/${ssid}`).then(() => {
      getWifis();
    });
  }

  useEffect(() => {
    getWifis();
  }, []);

  async function submitForm(ssidField: string, passwordField: string) {
    if (ssidField.trim() === "" || passwordField.trim() === "") {
      alert("SSID and Password are required");
      return;
    }
    const data = await axios.post(
      `${BASE_URL}/qrcode`,
      {
        ssid: ssidField,
        password: passwordField,
      },
      { responseType: "blob" },
    );
    if (data.status == 200) {
      const reader = new window.FileReader();
      reader.readAsDataURL(data.data);
      reader.onloadend = () => {
        const base64data = reader.result;
        const a = document.createElement("a");
        a.href = base64data as string;
        a.download = `${ssidField} - QR Code`;
        a.click();
      };
    } else if (data.status == 400) {
      alert("SSID and Password are required");
      return;
    } else if (data.status == 409) {
      alert("Wifi with specified SSID is already registered");
      return;
    }
    getWifis();
  }
  return (
    <div className="sm:w-max-3xl mb-16 flex w-full flex-col items-center justify-center gap-8">
      <div className="mb-4 mt-16 w-full text-center">
        <p className="text-5xl tracking-wide">Wifi label creator</p>
      </div>
      <div className="flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row">
        <div>
          <p>SSID:</p>
          <input
            onChange={(e) => setSsidField(e.target.value)}
            className="rounded border border-black"
            type="text"
            id="ssid"
            name="ssid"
            required
          />
        </div>
        <div>
          <p>Password:</p>
          <input
            onChange={(e) => setPasswordField(e.target.value)}
            className="rounded border border-black"
            type="password"
            id="password"
            name="password"
            required
          />
        </div>
        {/* <div className="flex flex-col items-end"> */}
        <button
          className="rounded bg-black px-2 py-1 text-white sm:self-end"
          type="button"
          onClick={() => submitForm(ssidField, passwordField)}
        >
          Submit
        </button>
        {/* </div> */}
      </div>
      {wifis.length ? (
        wifis.map((wifi) => {
          return (
            <div
              className="m-4 flex flex-col items-center justify-center gap-4 rounded border border-black p-4 lg:max-w-3xl lg:flex-row"
              key={wifi.ssid}
            >
              <div>
                <img
                  className="h-96 w-96 object-scale-down"
                  src={`${BASE_URL}/${wifi.qr_code_url}`}
                  alt={wifi.ssid}
                />
              </div>
              <div className="flex flex-row items-center">
                <div className="flex min-w-72 flex-col gap-8 text-2xl">
                  <div className="flex flex-col gap-1">
                    <p>SSID:</p>
                    <p>{wifi.ssid}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p>Password:</p>
                    <p>{wifi.password}</p>
                  </div>
                </div>
                <div
                  className="cursor-pointer rounded p-2 hover:bg-slate-100"
                  onClick={() => removeWifi(wifi.ssid)}
                >
                  <img src={TrashIcon} alt="" />
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-2xl">No wifis</div>
      )}
    </div>
  );
}

export default App;
