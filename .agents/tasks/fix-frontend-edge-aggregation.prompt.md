---
description: "Tối ưu hóa hiển thị đồ thị 2D: Gộp các cạnh (edges) trùng lặp trên Frontend để giảm nhiễu trực quan và tăng hiệu năng."
agent: "software-engineer"
---

# Task: Client-Side Edge Aggregation for Ego-Graph 2D

Bạn là một Chuyên gia Frontend chuyên về Data Visualization. Hiện tại, đồ thị mạng lưới của chúng ta (`EgoGraph2D`) đang gặp vấn đề "nhiễu thị giác" (visual clutter) nghiêm trọng vì có quá nhiều đường nối (edges) đè lên nhau giữa 2 node nếu chúng tương tác nhiều lần.

**Lưu ý quan trọng:** KHÔNG ĐƯỢC chạm vào Backend hay API. Toàn bộ logic gộp data phải được xử lý ở Client-side (Frontend) trước khi đưa vào render.

## 🎯 Task Objective

Viết logic gom nhóm (Aggregate) các cạnh có cùng `source`, `target` và `edge_type` thành MỘT cạnh duy nhất. Sử dụng tổng số cạnh bị gộp để tăng độ dày (width) và hiệu ứng hạt (particles) cho cạnh đó, giúp đồ thị gọn gàng mà vẫn thể hiện được cường độ tương tác.

## 📋 Step-by-Step Instructions

### Bước 1: Cập nhật logic xử lý Data (`src/components/graph/ego-graph-2d.tsx`)

- Mở file `src/components/graph/ego-graph-2d.tsx`.
- Tìm đến chỗ nhận `graphData` từ props.
- Sử dụng hook `useMemo` để tính toán ra một `aggregatedData` mới từ `graphData.links`.
- **Logic Gom nhóm (Aggregation):**
  - Tạo một Map/Dictionary.
  - Duyệt qua mảng `links`. Tạo một `uniqueKey` cho mỗi cạnh theo công thức: `${link.source}-${link.target}-${link.edge_type}`. _(Lưu ý: object source/target có thể đã bị thư viện mutate thành object, hãy lấy `.id` hoặc ép kiểu về string an toàn)_.
  - Nếu `uniqueKey` chưa có trong Map, thêm nó vào với thuộc tính `aggregated_weight = link.weight` (hoặc `1` nếu không có weight).
  - Nếu đã có, cộng dồn `aggregated_weight += link.weight`.
  - Cuối cùng, chuyển Map đó thành một mảng `aggregatedLinks` mới.
  - Trả về object: `{ nodes: graphData.nodes, links: aggregatedLinks }`.

### Bước 2: Cập nhật Props của `<ForceGraph2D>`

- Truyền `aggregatedData` vừa tạo vào prop `graphData` của `<ForceGraph2D>`.
- **Styling Cạnh (Link Width & Particles):**
  - Cập nhật prop `linkWidth`: Trả về giá trị tính toán từ `aggregated_weight`. (Gợi ý: Dùng hàm logarit hoặc căn bậc 2 như `Math.sqrt(link.aggregated_weight)` để đường nối không bị quá khổng lồ nếu tương tác 1000 lần). Cung cấp fallback tối thiểu là `1`.
  - Cập nhật prop `linkDirectionalParticles`: Trả về số lượng hạt (particles) phụ thuộc vào `aggregated_weight` (Ví dụ: trọng số càng cao, hạt chạy càng nhiều, max là 4-5 hạt).
  - Cập nhật prop `linkDirectionalParticleWidth`: Tăng nhẹ kích thước hạt nếu đường nối đó là đường gộp có trọng số cao.

## 🛑 Quality Constraints

1. **Performance:** Đảm bảo `useMemo` có dependency array chuẩn (`[graphData]`) để không bị tính toán lại mỗi lần render.
2. **Crash Prevention:** Thư viện `react-force-graph` sẽ tự động biến chuỗi `source` và `target` thành Object (chứa x, y) sau lần render đầu tiên. Do đó, hàm tạo `uniqueKey` phải kiểm tra: `const sourceId = typeof link.source === 'object' ? link.source.id : link.source;`
3. **Hardcore Industrial Vibe:** Cạnh gộp có trọng số cao nên phát sáng mờ (glow) bằng cách dùng rgba opacity thay vì để màu solid đục ngầu, giúp nhìn xuyên thấu lưới radar ở dưới.

## 📤 Output Format

Hãy xuất ra toàn bộ đoạn code đã được chỉnh sửa của file `src/components/graph/ego-graph-2d.tsx`.
