<template>
  <div class="landing-page">
    <header class="landing-header">
      <div class="header-inner">
        <div class="header-brand">
          <i class="el-icon-s-shop"></i>
          <span>校园二手平台</span>
        </div>
        <div class="header-links">
          <router-link to="/login" class="header-link">
            <i class="el-icon-user"></i> 登录
          </router-link>
        </div>
      </div>
    </header>
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title"><span class="hero-highlight">校园</span>二手交易平台</h1>
        <p class="hero-subtitle">发现校园好物 · 让闲置焕发新生 · 让交易更加便捷</p>
        <div class="hero-indicator"><span>选择你的入口</span><i class="el-icon-arrow-down"></i></div>
      </div>
    </section>
    <section class="projects-section">
      <div class="projects-inner">
        <div class="project-card project-market" @click="enterProject('market')">
          <div class="project-card-bg"></div>
          <div class="project-card-content">
            <div class="project-icon-wrapper"><i class="el-icon-shopping-bag-1"></i></div>
            <h2 class="project-name">校园集市</h2>
            <p class="project-desc">浏览、搜索闲置好物，发现校园里的宝贝</p>
            <div class="project-features">
              <span class="feature-tag"><i class="el-icon-search"></i> 浏览商品</span>
              <span class="feature-tag"><i class="el-icon-chat-dot-round"></i> 即时沟通</span>
              <span class="feature-tag"><i class="el-icon-shopping-cart-2"></i> 安全交易</span>
            </div>
            <div class="project-enter-btn"><span>进入集市</span><i class="el-icon-arrow-right"></i></div>
          </div>
        </div>
        <div class="project-card project-space" @click="enterProject('space')">
          <div class="project-card-bg"></div>
          <div class="project-card-content">
            <div class="project-icon-wrapper"><i class="el-icon-user-solid"></i></div>
            <h2 class="project-name">个人空间</h2>
            <p class="project-desc">管理你的闲置、订单、留言，打造个人小站</p>
            <div class="project-features">
              <span class="feature-tag"><i class="el-icon-upload2"></i> 发布闲置</span>
              <span class="feature-tag"><i class="el-icon-document"></i> 订单管理</span>
              <span class="feature-tag"><i class="el-icon-star-on"></i> 个人中心</span>
            </div>
            <div class="project-enter-btn"><span>进入空间</span><i class="el-icon-arrow-right"></i></div>
          </div>
        </div>
      </div>
    </section>
    <footer class="landing-footer"><p>校园二手交易平台 &copy; 2026</p></footer>
  </div>
</template>
<script>
export default {
  name: 'LandingPage',
  methods: {
    enterProject(project) {
      if (project === 'market') {
        this.$router.push({ path: '/index', query: { project: 'market' } });
      } else {
        this.$router.push({ path: '/index', query: { project: 'space' } });
      }
    }
  }
};
</script>
<style scoped>
.landing-page{min-height:100vh;background:#f0f2f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;overflow-x:hidden}
.landing-header{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(255,255,255,0.95);backdrop-filter:blur(10px);border-bottom:1px solid rgba(0,0,0,0.06)}
.header-inner{max-width:1200px;margin:0 auto;padding:0 24px;height:64px;display:flex;align-items:center;justify-content:space-between}
.header-brand{display:flex;align-items:center;gap:8px;font-size:20px;font-weight:700;color:#1a1a2e}
.header-brand i{font-size:24px;color:#e67e22}
.header-links{display:flex;gap:16px}
.header-link{display:flex;align-items:center;gap:4px;color:#555;text-decoration:none;font-size:14px;padding:8px 16px;border-radius:20px;transition:all 0.3s}
.header-link:hover{color:#e67e22;background:rgba(230,126,34,0.08)}
.hero-section{position:relative;height:60vh;min-height:420px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);overflow:hidden}
.hero-overlay{position:absolute;inset:0;background:radial-gradient(ellipse at 20% 50%,rgba(230,126,34,0.15) 0%,transparent 60%),radial-gradient(ellipse at 80% 50%,rgba(0,150,255,0.15) 0%,transparent 60%);pointer-events:none}
.hero-content{position:relative;text-align:center;z-index:1;animation:fadeInUp 0.8s ease-out}
@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
.hero-title{font-size:52px;font-weight:800;color:#fff;margin:0 0 16px;letter-spacing:2px}
.hero-highlight{background:linear-gradient(135deg,#e67e22,#f39c12);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero-subtitle{font-size:18px;color:rgba(255,255,255,0.7);margin:0 0 40px;letter-spacing:1px}
.hero-indicator{display:flex;flex-direction:column;align-items:center;gap:8px;color:rgba(255,255,255,0.4);font-size:13px;animation:bounce 2s infinite}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}
.projects-section{padding:80px 24px;max-width:1200px;margin:0 auto}
.projects-inner{display:grid;grid-template-columns:1fr 1fr;gap:40px}
.project-card{position:relative;min-height:480px;border-radius:20px;overflow:hidden;cursor:pointer;transition:all 0.5s cubic-bezier(0.25,0.46,0.45,0.94);box-shadow:0 10px 40px rgba(0,0,0,0.08)}
.project-card:hover{transform:translateY(-12px);box-shadow:0 20px 60px rgba(0,0,0,0.15)}
.project-card-bg{position:absolute;inset:0;transition:transform 0.6s ease}
.project-card:hover .project-card-bg{transform:scale(1.05)}
.project-market .project-card-bg{background:linear-gradient(145deg,#fff5ee 0%,#fde8d0 50%,#fbd5b5 100%)}
.project-market .project-icon-wrapper{background:linear-gradient(135deg,#e67e22,#f39c12);box-shadow:0 8px 24px rgba(230,126,34,0.3)}
.project-market .project-enter-btn{background:linear-gradient(135deg,#e67e22,#d35400);box-shadow:0 4px 16px rgba(230,126,34,0.3)}
.project-market .feature-tag{background:rgba(230,126,34,0.1);color:#c06e1e}
.project-space .project-card-bg{background:linear-gradient(145deg,#eef5ff 0%,#d0e4ff 50%,#b8d4ff 100%)}
.project-space .project-icon-wrapper{background:linear-gradient(135deg,#4a90d9,#357abd);box-shadow:0 8px 24px rgba(74,144,217,0.3)}
.project-space .project-enter-btn{background:linear-gradient(135deg,#4a90d9,#357abd);box-shadow:0 4px 16px rgba(74,144,217,0.3)}
.project-space .feature-tag{background:rgba(74,144,217,0.1);color:#3a7bc8}
.project-card-content{position:relative;z-index:1;padding:48px 40px;display:flex;flex-direction:column;align-items:center;text-align:center;height:100%;box-sizing:border-box}
.project-icon-wrapper{width:80px;height:80px;border-radius:20px;display:flex;align-items:center;justify-content:center;margin-bottom:28px;transition:transform 0.3s ease}
.project-card:hover .project-icon-wrapper{transform:scale(1.1) rotate(-5deg)}
.project-icon-wrapper i{font-size:36px;color:#fff}
.project-name{font-size:32px;font-weight:700;color:#1a1a2e;margin:0 0 12px}
.project-desc{font-size:16px;color:#555;margin:0 0 32px;line-height:1.6}
.project-features{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-bottom:36px}
.feature-tag{padding:6px 16px;border-radius:20px;font-size:13px;font-weight:500;display:flex;align-items:center;gap:4px}
.feature-tag i{font-size:14px}
.project-enter-btn{display:inline-flex;align-items:center;gap:8px;padding:14px 36px;border-radius:30px;color:#fff;font-size:16px;font-weight:600;transition:all 0.3s ease;cursor:pointer;border:none}
.project-enter-btn i{transition:transform 0.3s ease}
.project-card:hover .project-enter-btn i{transform:translateX(4px)}
.landing-footer{text-align:center;padding:32px 24px;color:#999;font-size:13px;border-top:1px solid #eee;background:#fff}
@media (max-width:968px){.projects-inner{grid-template-columns:1fr;gap:32px}.hero-title{font-size:36px}.hero-subtitle{font-size:15px}.project-card{min-height:400px}.project-card-content{padding:36px 28px}.project-name{font-size:26px}}
@media (max-width:480px){.hero-section{height:50vh;min-height:320px}.hero-title{font-size:28px}.project-card-content{padding:28px 20px}.project-name{font-size:22px}.project-desc{font-size:14px}.project-features{flex-direction:column;align-items:center}.project-enter-btn{padding:12px 28px;font-size:14px}}
</style>
