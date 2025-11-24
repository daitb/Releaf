import {
    Droplets,
    Leaf,
    Recycle,
    ShoppingBag,
    Sprout,
    Sun,
    Truck
} from 'lucide-react';

export const highlights = [
    {
        id: 1,
        icon: <Leaf className="w-7 h-7 text-green-600" />,
        title: 'Tự nhiên 100%',
        desc: 'Ưu tiên chất liệu hữu cơ, bảo vệ sức khỏe gia đình bạn.'
    },
    {
        id: 2,
        icon: <Truck className="w-7 h-7 text-green-600" />,
        title: 'Giao hàng 24h',
        desc: 'Đội ngũ vận chuyển phủ sóng toàn quốc, đảm bảo đúng hẹn.'
    },
    {
        id: 3,
        icon: <Recycle className="w-7 h-7 text-green-600" />,
        title: 'Chu trình khép kín',
        desc: 'Tái chế & xử lý rác thải ngay tại chuỗi cửa hàng Releaf.'
    },
    {
        id: 4,
        icon: <ShoppingBag className="w-7 h-7 text-green-600" />,
        title: 'Mua sắm thông minh',
        desc: 'Gợi ý sản phẩm dựa trên thói quen & mức độ phát thải.'
    }
];

export const stats = [
    { label: 'Năm đồng hành', value: '5+' },
    { label: 'Khách hàng xanh', value: '120K' },
    { label: 'Rác tái chế', value: '48 tấn' },
    { label: 'Điểm bán lẻ', value: '260+' }
];

export const categoryHighlights = [
    {
        id: 'eco-home',
        title: 'Gia dụng tái chế',
        desc: 'Nhựa sinh học, vải tencel & dụng cụ nhà bếp thân thiện.',
        icon: <Sprout className="w-6 h-6 text-green-500" />,
        accent: 'from-lime-100 via-emerald-50 to-white'
    },
    {
        id: 'beauty',
        title: 'Chăm sóc cơ thể',
        desc: 'Tinh dầu hữu cơ, đồ skincare thuần chay & refill station.',
        icon: <Sun className="w-6 h-6 text-amber-500" />,
        accent: 'from-amber-50 via-orange-50 to-white'
    },
    {
        id: 'lifestyle',
        title: 'Lifestyle bền vững',
        desc: 'Túi canvas, bình giữ nhiệt, outfit organic cotton.',
        icon: <Droplets className="w-6 h-6 text-blue-500" />,
        accent: 'from-sky-50 via-cyan-50 to-white'
    }
];

export const testimonials = [
    {
        id: 1,
        quote: '"Releaf giúp team mình chuyển đổi sang mô hình văn phòng xanh chỉ trong 2 tháng."',
        author: 'Lan Phương · HR Lead',
        impact: 'Tiết kiệm 1.2 tấn nhựa/năm'
    },
    {
        id: 2,
        quote: '"Sản phẩm refill rất tiện, chất lượng ổn định và được tư vấn tận tình."',
        author: 'Hoàng Minh · Chủ quán cafe',
        impact: 'Cắt giảm 80% bao bì nhựa'
    }
];

export const impactTimeline = [
    {
        step: '01',
        title: 'Chọn nguồn nguyên liệu',
        desc: 'Ưu tiên nông trại hữu cơ, hợp tác xã địa phương & nguồn tái chế.'
    },
    {
        step: '02',
        title: 'Sản xuất & kiểm định',
        desc: 'Đảm bảo tiêu chuẩn thuần chay, không thử nghiệm trên động vật.'
    },
    {
        step: '03',
        title: 'Vòng đời mới',
        desc: 'Chương trình thu gom & upcycle sản phẩm sau sử dụng.'
    }
];

