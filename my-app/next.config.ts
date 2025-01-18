/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['assets.minimals.cc']
    },
    typescript: {
        // Cho phép build sản phẩm thành công mặc dù có lỗi kiểu TypeScript
        ignoreBuildErrors: true
    }
}

export default nextConfig
