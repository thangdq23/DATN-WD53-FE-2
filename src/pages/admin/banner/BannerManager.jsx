import React, { useEffect, useState } from "react";
import { Button, Card, Input, Space, Image, message } from "antd";
import UploadImage from "../../../components/UploadImage";

const LS_KEY = "app:banners";

const getBanners = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const arr = JSON.parse(raw || "[]");
    if (Array.isArray(arr)) return arr.filter(Boolean);
    return [];
  } catch {
    return [];
  }
};

const setBanners = (list) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list || []));
    window.dispatchEvent(new Event("banners:update"));
  } catch {
    message.error("Không thể lưu banner. Bộ nhớ trình duyệt đã đầy.");
  }
};

const compressImage = (file, maxWidth = 1280, quality = 0.7) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const mime = file.type?.includes("png") ? "image/png" : "image/jpeg";
        try {
          const dataUrl = canvas.toDataURL(mime, quality);
          resolve(dataUrl);
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const BannerManager = () => {
  const [banners, setBannerState] = useState([]);
  const [url, setUrl] = useState("");
  const [uploadFiles, setUploadFiles] = useState([]);

  useEffect(() => {
    setBannerState(getBanners());
  }, []);

  const handleAddFromURL = () => {
    const clean = (url || "").trim();
    if (!clean) return;
    const next = [...banners, clean];
    setBannerState(next);
    setBanners(next);
    setUrl("");
  };

  const handleAddFromUpload = async () => {
    const file = uploadFiles?.[0]?.originFileObj;
    const urlExisting = uploadFiles?.[0]?.url;
    if (!file && !urlExisting) return;
    try {
      const dataUrl = urlExisting || (await compressImage(file));
      const next = [...banners, dataUrl];
      setBannerState(next);
      setBanners(next);
      setUploadFiles([]);
    } catch {
      message.error("Không thể thêm ảnh. Kích thước quá lớn hoặc định dạng không hỗ trợ.");
    }
  };

  const handleRemove = (idx) => {
    const next = banners.filter((_, i) => i !== idx);
    setBannerState(next);
    setBanners(next);
  };

  const move = (idx, dir) => {
    const next = [...banners];
    const swapWith = idx + dir;
    if (swapWith < 0 || swapWith >= next.length) return;
    [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
    setBannerState(next);
    setBanners(next);
  };

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4">Quản lý banner trang chủ</h3>

      <Card className="mb-6" title="Thêm banner">
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-medium mb-2">Từ URL/đường dẫn ảnh</p>
              <Space.Compact style={{ width: "100%" }}>
                <Input placeholder="Dán URL ảnh..." value={url} onChange={(e) => setUrl(e.target.value)} />
                <Button type="primary" onClick={handleAddFromURL}>Thêm</Button>
              </Space.Compact>
            </div>

            <div>
              <p className="font-medium mb-2">Tải ảnh lên</p>
              <UploadImage width={240} height={140} value={uploadFiles} onChange={setUploadFiles} />
              <div className="mt-2">
                <Button onClick={handleAddFromUpload} type="primary">Thêm từ ảnh tải lên</Button>
              </div>
            </div>
          </div>
        </Space>
      </Card>

      <Card title="Danh sách banner">
        {banners.length === 0 ? (
          <p className="text-slate-600">Chưa có banner. Hãy thêm mới ở trên.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((src, idx) => (
              <div key={idx} className="rounded-xl border p-3 bg-white shadow-sm">
                <Image src={src} alt={`banner-${idx}`} width="100%" height={140} style={{ objectFit: "cover", borderRadius: 8 }} />
                <div className="mt-3 flex items-center justify-between">
                  <Space>
                    <Button size="small" onClick={() => move(idx, -1)}>Lên</Button>
                    <Button size="small" onClick={() => move(idx, 1)}>Xuống</Button>
                  </Space>
                  <Button danger size="small" onClick={() => handleRemove(idx)}>Xóa</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default BannerManager;
