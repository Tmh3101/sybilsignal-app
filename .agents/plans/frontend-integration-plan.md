# 🗺️ Kế hoạch Tích hợp Frontend & Backend (Sybil Detection)

**Mục tiêu:** Đồng bộ hóa hoàn toàn schema dữ liệu, API endpoints và UI components của Frontend với kiến trúc Backend mới nhất (v1.2).

---

## 🛠️ Phase 1: Chuẩn hóa Tầng Dữ Liệu (Type Definitions)

_Tầng này cần làm đầu tiên để TypeScript compiler giúp chúng ta phát hiện các lỗi ở các phase sau._

- [ ] **1.1. Cập nhật `src/types/api.d.ts` (Core Types)**
  - Thay thế interface `SybilEdge` cũ bằng 12 loại type mới: `"FOLLOW" | "UPVOTE" | "REACTION" | "COMMENT" | "QUOTE" | "MIRROR" | "COLLECT" | "CO-OWNER" | "SAME_AVATAR" | "FUZZY_HANDLE" | "SIM_BIO" | "CLOSE_CREATION_TIME" | "UNKNOWN"`.
  - Đổi tên biến `total_mirrors` thành `total_reposts` bên trong interface `SybilNode['attributes']`.
  - Cập nhật label rủi ro: `"BENIGN" | "LOW_RISK" | "HIGH_RISK" | "MALICIOUS"`.

- [ ] **1.2. Cập nhật Schema của API Responses & Requests**
  - Xóa bỏ interface `Analysis`, `LocalGraph` cũ.
  - Tạo mới `SybilReport` interface.
  - Cập nhật `InspectorResponse` để sử dụng `report` và `ego_graph` (chứa `nodes` và `edges`).
  - Tái cấu trúc `DiscoveryStartRequest` thành dạng nested object: Nhóm start/end date vào object `time_range` và thêm optional `hyperparameters`.

---

## 🔌 Phase 2: Cập nhật Tầng Giao Tiếp (API Client & Hooks)

_Đảm bảo các request bắn đi đúng địa chỉ và đúng định dạng payload._

- [ ] **2.1. Cập nhật `src/hooks/use-sybil-discovery.ts` (Luồng Train AI)**
  - Đổi endpoint khởi chạy từ `POST /api/v1/sybil/discovery` thành `POST /api/v1/sybil/discovery/start`.
  - Đổi endpoint tra cứu (polling) từ `GET /api/v1/sybil/discovery/status/{taskId}` thành `GET /api/v1/sybil/discovery/{taskId}` (xóa chữ `/status/`).
  - Sửa đổi tham số truyền vào hàm mutation để khớp với cấu trúc `time_range` mới.

- [ ] **2.2. Kiểm tra `src/hooks/use-sybil-inference.ts` (Luồng Real-time)**
  - Đảm bảo hook trích xuất đúng dữ liệu từ `response.data.report` và `response.data.ego_graph` thay vì schema cũ.

- [ ] **2.3. Cập nhật `src/lib/api.ts` (Axios/Fetch Client)**
  - (Tùy chọn) Kiểm tra xem có cấu hình baseURL hoặc timeout nào cần tăng lên không (do quá trình tính toán matrix S-BERT dù đã cache nhưng vẫn tốn vài trăm ms).

---

## 🎨 Phase 3: Nâng cấp Tầng Hiển Thị (UI Components)

_Sửa các lỗi crash UI và render lại giao diện hiển thị đồ thị._

- [ ] **3.1. Cập nhật Component Đồ thị `src/components/graph/ego-graph-2d.tsx` (hoặc 3D)**
  - **Color Mapping:** Bổ sung bảng màu (color palette) cho 12 loại Edge mới. (Ví dụ: `CO-OWNER` màu đỏ rực, `SIM_BIO` màu cam, `FOLLOW` màu xám nhạt).
  - Đổi key truy cập mảng cạnh từ `graphData.links` sang `graphData.edges` (nếu Backend trả về key `edges` trong module 2).
  - Cập nhật nội dung Tooltip khi hover vào Node: Chuyển text hiển thị từ `Mirrors: ...` sang đọc giá trị từ `node.attributes.total_reposts`.

- [ ] **3.2. Cập nhật Bảng điều khiển `src/components/ui/terminal-log.tsx`**
  - Chỉnh sửa logic in log: Đọc dữ liệu giải thích từ biến `data.report.reasoning` thay vì `data.analysis.reasoning`.
  - Mapping màu sắc cho Label mới: `MALICIOUS` (Đỏ/Cảnh báo nhấp nháy), `HIGH_RISK` (Cam), `LOW_RISK` (Vàng), `BENIGN` (Xanh lá).

- [ ] **3.3. Cập nhật `src/components/ui/industrial-card.tsx`**
  - Đảm bảo thẻ hiển thị Risk Score chuẩn xác (Backend hiện đang trả về Float từ `0.0` đến `1.0`). Frontend cần nhân với `100` và thêm `%` khi render ra giao diện.

---

## 🚀 Phase 4: Tinh chỉnh Tầng Luồng (Pages)

_Cập nhật logic xử lý form của người dùng trước khi gọi API._

- [ ] **4.1. Trang `src/app/discovery/page.tsx`**
  - Khi người dùng bấm nút "Start Discovery", format lại dữ liệu form thành cấu trúc Nested JSON:
    ```javascript
    const payload = {
      time_range: { start_date: form.startDate, end_date: form.endDate },
      max_nodes: 2000,
      hyperparameters: { max_epochs: 400, patience: 30 },
    };
    ```

- [ ] **4.2. Trang `src/app/inspector/page.tsx`**
  - Kiểm tra lại các biến state lưu trữ kết quả trả về để truyền prop chính xác xuống các component con (EgoGraph, TerminalLog).

---

## 🔬 Phase 5: Kiểm thử (Testing)

- [ ] **5.1. Xóa Cache:** Clear cache của trình duyệt và state của React Query để tránh dính dữ liệu theo schema cũ.
- [ ] **5.2. Test Discovery Luồng (Module 1):** Bấm start, theo dõi terminal log tiến độ (polling) xem có báo lỗi 404 không.
- [ ] **5.3. Test Inference Luồng (Module 2):** Nhập 1 Profile ID mới toanh. Đợi API Fallback chạy (khoảng ~1-2s do đã tối ưu Vector Cache). Kiểm tra xem biểu đồ 2D/3D có vẽ đúng các cạnh `SIM_BIO` hoặc `CO-OWNER` hay không.

---
