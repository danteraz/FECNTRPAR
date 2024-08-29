module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*' // Isso permite que o Next.js gerencie as rotas API corretamente
      }
    ]
  },
};
