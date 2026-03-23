---
description: "Khởi tạo nền móng dự án Next.js (App Router) cho Sybil Engine Dashboard với cấu trúc thư mục chuẩn và hệ thống Design Token Hardcore Industrial."
agent: "architect"
---

# Sybil Engine - Frontend Initialization Prompt

Bạn là một Chuyên gia Kiến trúc sư Frontend (Frontend Architect) với chuyên môn sâu về Next.js (App Router), TypeScript, và thiết kế UI/UX theo phong cách "Hardcore Industrial Tech" (Neumorphism).

## 🎯 Task Objective

Nhiệm vụ của bạn là khởi tạo bộ khung dự án (Scaffold) cho hệ thống "Sybil Discovery Engine". KHÔNG đi sâu vào việc code logic phức tạp hay vẽ đồ thị ngay lúc này. Mục tiêu là thiết lập môi trường, cài đặt thư viện, cấu hình Tailwind CSS, dựng khung thư mục và định nghĩa các Type cốt lõi.

## 🛠️ Step-by-Step Instructions

### Bước 1: Khởi tạo và Cài đặt Dependencies

Giả định dự án đã được tạo bằng `create-next-app`. Hãy hướng dẫn/cung cấp lệnh để cài đặt các thư viện lõi sau:

- State Management: `zustand`
- Data Fetching: `@tanstack/react-query`
- Styling & UI Utils: `lucide-react`, `clsx`, `tailwind-merge`
- Graph (Cài sẵn để dùng sau): `react-force-graph-2d`, `react-force-graph-3d`, `three`

### Bước 2: Cấu hình Tailwind CSS (`tailwind.config.ts`)

Dựa vào phong cách "Hardcore Industrial" (tham khảo file `prompt.xml` đính kèm), hãy cấu hình file Tailwind với các thông số sau:

- **Colors**:
  - Nền hệ thống (Background): Dải màu xám kim loại đậm (`slate-900` đến `slate-950` hoặc `#0a0b10`).
  - Thẻ/Bề mặt (Surface): Xám đen bóng (`#14161f`).
  - Điểm nhấn (Accents): Electric Cyan (`#00f2ff`), Warning Red (`#ff1744`), Safe Green (`#00e676`).
- **Box Shadows (Neumorphism)**:
  - Tạo class `shadow-neo-convex` (Lồi lên) kết hợp bóng tối dưới và bóng sáng trên.
  - Tạo class `shadow-neo-concave` (Lõm xuống/Inset) cho các ô chứa số liệu (Terminal input, data tags).
- **Fonts**: Cấu hình font Monospace (vd: `JetBrains Mono` hoặc `Fira Code`) làm font phụ (`font-mono`) cho các con số/địa chỉ ví.

### Bước 3: Thiết lập Cấu trúc Thư mục (Project Structure)

Hãy tạo ra các file và thư mục rỗng (placeholder files) theo đúng cấu trúc sau trong thư mục `src/`:

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── inspector/page.tsx
│   └── discovery/page.tsx
├── components/
│   ├── ui/ (Chứa các base components: button, card)
│   ├── layout/ (Chứa sidebar.tsx, top-header.tsx)
│   ├── inspector/
│   ├── discovery/
│   └── graph/
├── lib/
│   ├── api.ts
│   └── utils.ts
├── hooks/
├── store/
└── types/
    ├── api.d.ts
    └── graph.d.ts
```

### Bước 4: Định nghĩa TypeScript Interfaces (`src/types/api.d.ts`)

Đây là bước cực kỳ quan trọng. Dựa trên dữ liệu hệ thống Sybil (GAT + Random Forest), hãy viết các Type sau:

1. `SybilNode`: Gồm id (string), label, trust_score, is_sybil (boolean), attributes (follower, following...).
2. `SybilEdge`: Gồm source, target, type (comment, follow, upvote), weight.
3. `InferenceReasoning`: Gồm type (vd: SIM_BIO), description, severity.
4. `InspectorResponse`: API Response trả về cho Module 2, bao gồm `profile_id`, `final_probability`, `classification`, mảng `reasoning`, và đối tượng `local_graph` (chứa nodes và edges).

### Bước 5: Cấu trúc Layout Tổng (`src/app/layout.tsx`)

Viết code cho file Layout tổng. Nó phải bọc toàn bộ ứng dụng bằng một `MainShell` chứa:

- `TopHeader`: Thanh bar phía trên cùng có tên dự án và trạng thái API giả lập.
- `Sidebar`: Thanh menu bên trái với 2 link điều hướng: "/inspector" và "/discovery".
- Phần `children` sẽ nằm ở vùng trung tâm (Main content area).
- Giao diện phải tràn viền màn hình (h-screen, w-screen), nền xám kim loại đen (`bg-slate-950`), text màu sáng (`text-slate-200`).

## 🛑 Quality Constraints

- Output trả về là các khối mã nguồn (Code Blocks) rõ ràng cho từng file được yêu cầu.
- Tuyệt đối không nhồi nhét code logic vẽ đồ thị (Force Graph) vào bước này. Chỉ cần thiết lập khung.
- Đảm bảo các component Layout dùng thẻ semantic (`<aside>`, `<header>`, `<main>`).
