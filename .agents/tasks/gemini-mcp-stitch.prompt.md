---
description: "Sử dụng MCP để tự động tạo và ghép (stitch) các Component React/Next.js cho giao diện Sybil Engine Dashboard."
agent: "software-engineer"
tools: ["mcp-file-system", "mcp-stitch"]
---

# Sybil Engine - MCP UI Stitching Directive

Bạn là một Kỹ sư Frontend siêu việt, được trang bị công cụ MCP để thao tác trực tiếp với hệ thống file. Nhiệm vụ của bạn là đọc các yêu cầu thiết kế và tự động TẠO/GHI các file code React (Next.js) vào đúng cấu trúc thư mục của dự án.

## 🎯 Mục tiêu (The Objective)

Hiện thực hóa giao diện "Sybil Discovery Engine" theo phong cách **Hardcore Industrial Tech** (Neumorphism, Dark Mode kim loại, chi tiết cơ khí). KHÔNG code logic fetch API thật. CHỈ tập trung vào UI tĩnh (Static UI), Layout, và Mock Data.

## 🗂️ Ngữ cảnh Dự án (Context)

Dự án sử dụng: Next.js (App Router), Tailwind CSS, TypeScript, `lucide-react`.
Màu sắc chủ đạo: Nền `slate-950`, Thẻ `slate-900`, Viền kim loại, Cyan (`#00f2ff`), Đỏ (`#ff1744`).

## ⚙️ Chỉ thị Thực thi MCP (Execution Steps)

Sử dụng công cụ MCP của bạn để lần lượt tạo/ghi nội dung vào các file sau. Bắt buộc code phải hoàn chỉnh, không dùng placeholder lười biếng.

### Bước 1: Tạo các UI Primitives (Thành phần cơ bản)

Sử dụng MCP ghi vào các file sau:

1. `src/components/ui/industrial-card.tsx`:
   - Tạo một thẻ div có viền `border-slate-800`, nền gradient tối, và hiệu ứng bóng đổ (box-shadow) lõm/lồi. Thêm 4 chấm tròn nhỏ ở 4 góc mô phỏng ốc vít cơ khí.
2. `src/components/ui/terminal-log.tsx`:
   - Tạo một ô nền đen tuyền (`bg-black`), text màu xanh lá (`text-green-400`), font monospace, mô phỏng cửa sổ dòng lệnh đang chạy log.

### Bước 2: Tạo Layout Hệ thống

Sử dụng MCP ghi vào các file sau:

1. `src/components/layout/sidebar.tsx`:
   - Sidebar dọc bên trái, màu kim loại tối. Chứa 2 tab (sử dụng Next.js `<Link>`): "Profile Inspector" (icon: Radar) và "Discovery Lab" (icon: Flask).
2. `src/components/layout/top-header.tsx`:
   - Thanh bar ngang có logo "SYBIL ENGINE" (Cyan phát sáng) và trạng thái hệ thống góc phải.
3. `src/app/layout.tsx`:
   - Ghép Sidebar và TopHeader vào thành một khung Dashboard hoàn chỉnh, vùng `<main>` nằm ở giữa.

### Bước 3: Ghép Module 2 - Profile Inspector (Trang phân tích 1 ví)

Sử dụng MCP ghi vào file: `src/app/inspector/page.tsx`

- Bố cục lưới (Grid) 3 cột: `grid-cols-12` (Trái: 3, Giữa: 6, Phải: 3).
- **Cột Trái**: Code một Mock Gauge Chart bằng thẻ `<svg>` vẽ vòng cung báo động đỏ (Risk Score 85%), bên dưới là `<TerminalLog>` hiển thị lý do.
- **Cột Giữa**: Nền `bg-[url('/grid-pattern.svg')]` (hoặc tạo lưới CSS). Tạo một `<svg>` khổng lồ giả lập mạng lưới node (Ego Graph 3D mock) với 1 node mục tiêu to ở giữa và các tia nối ra xung quanh.
- **Cột Phải**: Chứa các `<IndustrialCard>` hiển thị thông số Wallet, Trust Score, Avatar.

### Bước 4: Ghép Module 1 - Discovery Lab (Trang nghiên cứu)

Sử dụng MCP ghi vào file: `src/app/discovery/page.tsx`

- Bố cục dòng (Flex/Flex-col).
- **Top Bar**: Dùng `<IndustrialCard>` để bọc form chọn "Start Date" và "End Date". Có nút "START DISCOVERY" viền đỏ to.
- **Vùng Giữa**: Rộng nhất. Tạo một `<svg>` giả lập bản đồ các cụm Sybil (Cluster map) với hàng chục hình tròn nhỏ li ti phân thành 3 đám mây màu sắc khác nhau (Tím, Cam, Đỏ).
- **Vùng Đáy**: Cửa sổ `<TerminalLog>` nằm ngang hiển thị quá trình giả lập (Fetching from BigQuery... Training GAE...).

## 🛑 Yêu cầu Kiểm soát Chất lượng

1. Mọi component phải export default và dùng `"use client"` nếu cần thiết.
2. Không import các module chưa tồn tại (trừ `lucide-react` và các component bạn vừa tạo).
3. Đảm bảo Tailwind classes sinh ra đúng phong cách máy móc, cứng cáp (`rounded-sm`, `shadow-inner`, gradient kim loại).
