---
description: "Hoàn thiện trải nghiệm người dùng (UX), xử lý Cold Start của Serverless GPU và thêm hệ thống thông báo (Toast) mang phong cách Industrial."
agent: "software-engineer"
---

# Task 5: UX Polish & Cold Start Handling

Bạn là một Chuyên gia UX/UI Frontend đang thực hiện bước "đánh bóng" cuối cùng cho hệ thống "Sybil Engine". Các module cốt lõi đã hoạt động, dữ liệu đã được nối. Nhiệm vụ của bạn bây giờ là xử lý các "góc chết" trong trải nghiệm người dùng, đặc biệt là thời gian chờ (Cold Start) đặc thù của hạ tầng Serverless GPU Modal (có thể mất 15-20s để khởi động model AI).

## 🎯 Task Objective

Thêm thư viện thông báo (Toast Notifications) toàn cục, thiết kế các trạng thái Loading (Boot sequence) cực ngầu mang phong cách hacker/cơ khí, và xử lý mượt mà các trạng thái lỗi (Error) hoặc trạng thái trống (Empty State).

## 📋 Step-by-Step Instructions

### Bước 1: Cài đặt và Cấu hình Toast Notifications

- Chạy lệnh cài đặt thư viện: `npm install sonner` (hoặc `react-hot-toast`). _Sonner được ưu tiên vì dễ custom CSS._
- Cập nhật `src/app/layout.tsx`: Import component `<Toaster />` và đặt nó vào trong `<body>`.
- **Styling Toast (Industrial Vibe):** Cấu hình Toaster với theme dark, font monospace, viền màu kim loại hoặc neon. Ví dụ (với Sonner):
  `toastOptions={{ className: 'bg-slate-950 border border-slate-800 text-cyan-400 font-mono rounded-sm shadow-neo-convex' }}`

### Bước 2: Bắt lỗi API tập trung (`src/lib/api.ts`)

- Mở file `api.ts`. Trong phần `axios.interceptors.response`, cập nhật logic báo lỗi.
- Import hàm `toast` từ thư viện vừa cài.
- Khi có lỗi (e.g., `error.response`), gọi `toast.error(message)` để hiển thị thông báo lỗi (ví dụ: `[SYS_ERR] CONNECTION REFUSED` hoặc `INVALID WALLET ADDRESS`). Định dạng chữ phải theo kiểu log hệ thống.

### Bước 3: Thiết kế Hiệu ứng Cold Start (Boot Sequence)

Khi Modal API bị ngủ đông, request đầu tiên sẽ rất chậm. Nếu chỉ để vòng tròn xoay xoay (spinner) thì rất nhàm chán.

- Trong `src/app/inspector/page.tsx`, tại phần xử lý trạng thái `isLoading` của React Query:
- Tạo một component `<BootSequenceLoader />` (có thể code thẳng trong file hoặc tách ra `src/components/ui/`).
- Component này có nền đen lưới, hiển thị các dòng chữ nhấp nháy (Blink effect) theo thứ tự giả lập:
  1. `> WAKING UP AI CORE...`
  2. `> ALLOCATING GPU VRAM...`
  3. `> LOADING GAT MODELS...`
  4. `> ESTABLISHING NEURAL LINK...`
     _(Có thể dùng CSS animation cơ bản để hiện dần các dòng chữ này)._

### Bước 4: Hoàn thiện Empty States (Trạng thái Standby)

- **Trong Inspector:** Khi chưa có `walletId` trên URL, hiển thị một màn hình Standby ngầu. Ví dụ: Vẽ một logo radar tĩnh hoặc hiển thị dòng chữ `[ SYSTEM STANDBY ] - AWAITING TARGET INPUT` căn giữa màn hình radar.
- **Trong Discovery:** Khi chưa bấm Start, khu vực Cluster Map nên hiển thị một hình mờ lưới tọa độ trống với thông điệp: `NO DATA. SELECT TIME RANGE TO BEGIN SCAN.`

### Bước 5: Micro-interactions (Tương tác nhỏ)

- Các nút bấm (như nút "START DISCOVERY") phải bị `disabled` và có hiệu ứng nhấn chìm (`active:shadow-inner` hoặc đổi sang bóng `shadow-neo-concave`) khi đang loading.
- Khi di chuột vào các thẻ thông tin (Industrial Card), thêm hiệu ứng sáng viền nhẹ (`hover:border-cyan-500/50 transition-colors`).

## 🛑 Quality Constraints

1. **No Layout Shift:** Các hiệu ứng Loading và Standby phải chiếm đúng kích thước của các Component thật (ví dụ cái Radar ảo phải to bằng cái Radar 3D thật) để khi load xong UI không bị giật/nhảy.
2. **Tone & Voice:** Mọi câu chữ trong thông báo lỗi hoặc loading đều phải mang giọng điệu của máy móc, hệ thống AI, tình báo (Sử dụng viết hoa `UPPERCASE` và các tiền tố như `[SYS]`, `[ERR]`, `[WARN]`).

## 📤 Output Format

Trả về code hoặc dùng MCP để ghi trực tiếp các file:

1. `src/app/layout.tsx` (thêm Toaster).
2. `src/lib/api.ts` (cập nhật interceptor thêm toast).
3. `src/app/inspector/page.tsx` (thêm BootSequenceLoader và Standby state).
4. `src/app/discovery/page.tsx` (thêm Standby state và disable nút).
