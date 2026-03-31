# Implementation Plan: Frontend Refactor & Statistics Dashboard

## 1. Overview
**Mục tiêu:** Đồng bộ hóa ứng dụng Frontend (Next.js) với các thay đổi cấu trúc dữ liệu từ Backend (áp dụng trọng số Logarit, cạnh ngược `_REV`, Ràng buộc 2/3), đồng thời xây dựng một trang Thống kê (Statistics Dashboard) mới hiển thị các chỉ số cốt lõi của mạng lưới.

**Nguyên tắc thiết kế (Architectural Principles):**
- **DRY & YAGNI:** Tái sử dụng các component biểu đồ hiện có nếu được, không viết quá mức cần thiết cho đến khi có yêu cầu thực tế.
- **Phân tách rõ ràng (Separation of Concerns):** Tách biệt logic fetching dữ liệu (Hooks) khỏi logic hiển thị (UI Components).
- **Graceful Degradation:** Xử lý an toàn các trường hợp API lỗi hoặc dữ liệu rỗng.

**Phạm vi (Scope):**
Kế hoạch này được chia làm hai giai đoạn độc lập:
1. **Giai đoạn 1 (Phần A):** Refactor và đồng bộ tính năng đồ thị hiện có (Universal Graph 2D/3D & Inspector).
2. **Giai đoạn 2 (Phần B):** Xây dựng trang `/stats` mới và tích hợp biểu đồ.

---

## 2. File Map (Cấu trúc file bị ảnh hưởng)

### Giai đoạn 1: Refactor (Đồng bộ)
- `src/types/api.d.ts` (Sửa đổi): Cập nhật kiểu dữ liệu cho `EdgeType` và `GraphEdge`.
- `src/components/graph/universal-graph-2d.tsx` (Sửa đổi): Cập nhật logic filter cạnh và tính độ dày cạnh.
- `src/components/inspector/node-detail-panel.tsx` (Sửa đổi): Cập nhật logic hiển thị `reasons` (highlight điểm phạt).
- `src/components/inspector/edge-detail-panel.tsx` (Sửa đổi - Nếu có): Hiển thị trường `violations` cho cạnh `SIMILARITY`.

### Giai đoạn 2: Statistics Dashboard
- `package.json` (Sửa đổi): Thêm thư viện `recharts`.
- `src/hooks/use-stats.ts` (Tạo mới): Hook gọi 4 API thống kê.
- `src/components/layout/sidebar.tsx` (Sửa đổi): Thêm Navigation Link.
- `src/app/stats/page.tsx` (Tạo mới): Giao diện chính của trang Thống kê.
- `src/components/stats/kpi-cards.tsx` (Tạo mới): Component hiển thị số tổng quan.
- `src/components/stats/network-structure-chart.tsx` (Tạo mới): Component biểu đồ Donut.
- `src/components/stats/risk-distribution-chart.tsx` (Tạo mới): Component biểu đồ Bar.
- `src/components/stats/trust-score-histogram.tsx` (Tạo mới): Component biểu đồ Histogram.

---

## 3. Tasks Breakdown

### GIAI ĐOẠN 1: ĐỒNG BỘ TYPE VÀ REFACTOR UI

#### Task 1.1: Cập nhật Type Definitions
- **File:** `src/types/api.d.ts` (hoặc `src/types/graph.d.ts`)
- **Chi tiết:**
  1. Cập nhật type/enum `EdgeType`: Bổ sung các giá trị hậu tố `_REV` (`FOLLOW_REV`, `UPVOTE_REV`, `REACTION_REV`, `COMMENT_REV`, `QUOTE_REV`, `MIRROR_REV`, `COLLECT_REV`, `TIP_REV`).
  2. Cập nhật interface `GraphEdge` (hoặc tương đương): Thêm thuộc tính optional `violations?: string[]`.
- **Kiểm tra (Testing):** Chạy `npm run type-check` (hoặc lệnh tsc tương đương) đảm bảo không có lỗi type.

#### Task 1.2: Cập nhật Universal Graph (Lọc cạnh và Độ dày)
- **File:** `src/components/graph/universal-graph-2d.tsx` (và 3D nếu dùng chung logic)
- **Chi tiết:**
  1. **Lọc cạnh `_REV`:** Trong hàm prepare `graphData` trước khi truyền vào `ForceGraph2D`, sử dụng `useMemo` để lọc bỏ các link có `type.endsWith('_REV')`. Mục đích: Tránh render hai đường thẳng đè lên nhau.
  2. **Độ dày cạnh (Edge Thickness):** Cập nhật thuộc tính `linkWidth` của `ForceGraph2D`. Vì Backend đã dùng Log-scale (trọng số nhỏ hơn), hãy cập nhật công thức thành `Math.max(1, link.weight * 1.2)` (hoặc một hệ số phù hợp để đồ thị hiển thị rõ nét).
- **Kiểm tra (Testing):** Mở trang Discovery, tải một đồ thị. Đảm bảo UI không bị vỡ và các đường kết nối hiển thị thanh mảnh, mượt mà.

#### Task 1.3: Cập nhật Node Inspector (Hiển thị điểm phạt)
- **File:** `src/components/inspector/node-detail-panel.tsx`
- **Chi tiết:**
  1. Trong danh sách hiển thị các `reasons` của một node, viết một hàm helper `formatReason(text: string)`.
  2. Sử dụng Regex `/ \+\d+$/` để tìm các chuỗi điểm phạt (ví dụ: `+40`, `+30`) ở cuối câu.
  3. Render chuỗi điểm phạt này trong thẻ `<span>` với class CSS làm nổi bật (ví dụ: `font-bold text-red-500` hoặc màu tương đương trong design system của bạn).
- **Kiểm tra (Testing):** Click vào một node bị nghi ngờ Sybil. Đảm bảo text hiển thị màu sắc chính xác ở phần điểm phạt.

---

### GIAI ĐOẠN 2: XÂY DỰNG TRANG THỐNG KÊ (STATISTICS DASHBOARD)

#### Task 2.1: Cài đặt thư viện và chuẩn bị Navigation
- **Hành động:** Chạy lệnh `npm install recharts` (hoặc `pnpm add recharts`).
- **File:** `src/components/layout/sidebar.tsx`
- **Chi tiết:** Bổ sung một mục "Statistics" (hoặc "Thống kê") với icon biểu đồ. Link trỏ đến `/stats`.

#### Task 2.2: Viết Data Fetching Hooks
- **File:** `src/hooks/use-stats.ts`
- **Chi tiết:**
  1. Viết một custom hook (có thể dùng SWR, React Query hoặc fetch native tùy stack hiện tại).
  2. Thực hiện gọi đồng thời (hoặc tuần tự) 4 endpoints:
     - `GET /api/v1/stats/overview`
     - `GET /api/v1/stats/risk-distribution`
     - `GET /api/v1/stats/trust-scores`
     - `GET /api/v1/stats/clusters`
  3. Trả về state thống nhất: `{ data, isLoading, isError }`. Xử lý graceful degradation nếu một API fail.

#### Task 2.3: Tạo UI Layout Trang Thống Kê
- **File:** `src/app/stats/page.tsx`
- **Chi tiết:**
  1. Tạo cấu trúc trang với tiêu đề "Network Statistics".
  2. Gọi hook `useStats()`. Nếu `isLoading`, hiển thị skeleton/spinner.
  3. Dựng CSS Grid (sử dụng Tailwind) với cấu trúc 3 tầng:
     - Tầng 1: Hàng chứa các KPI Cards.
     - Tầng 2: Hai cột chia đôi (Donut Chart và Bar Chart).
     - Tầng 3: Một cột full width cho Histogram.

#### Task 2.4: Xây dựng các Component Biểu đồ (Recharts)
- **Tạo thư mục:** `src/components/stats/`
- **Chi tiết từng component:**
  1. `kpi-cards.tsx`: Nhận props `totalNodes`, `totalEdges`, `totalClusters`, `avgClusterSize`. Render thành các thẻ chỉ số nổi bật.
  2. `network-structure-chart.tsx`: Nhận mảng `edge_distribution`. Sử dụng `<PieChart>` của Recharts để vẽ dạng Donut. (Hover hiện %).
  3. `risk-distribution-chart.tsx`: Nhận mảng `distribution` (từ API risk). Sử dụng `<BarChart>` để vẽ cột số lượng tài khoản theo nhãn.
  4. `trust-score-histogram.tsx`: Nhận mảng `bins` (từ API trust-scores). Sử dụng `<BarChart>` để giả lập Histogram.
- **Kiểm tra (Testing):** Truy cập `/stats`. Xác nhận dữ liệu load thành công, biểu đồ render đúng màu sắc và responsive trên các kích thước màn hình khác nhau.

---

## 4. Acceptance Criteria (Điều kiện nghiệm thu)
- [ ] Không có lỗi TypeScript compilation.
- [ ] Không có cảnh báo trùng lặp cạnh (duplicate key/id) trong console khi render đồ thị.
- [ ] Truy cập `/stats` không bị crash, hiển thị đầy đủ 3 loại biểu đồ và KPI cards với dữ liệu thực từ Backend.
- [ ] Giao diện (Responsive) không bị vỡ trên màn hình Desktop (>= 1024px).