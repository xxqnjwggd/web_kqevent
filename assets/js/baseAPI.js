// 每次调用 $.get() 或 $.post() 或 $.ajax() 时，会先调用 ajaxPrefilter 这个函数， 这个函数中可以先拿到给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    // http://api-breakingnews-web.itheima.net http://ajax.frontend.itheima.net
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
        // console.log(options.url)
        // 统一为有权限的接口，设置 headers 请求头
        // 如果路径中包含 /my 就拼接 headers 请求头，不包含的则不需要该属性
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 全局统一挂载 complete 回调函数
    options.complete = function(res) {
        // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空 token 
            localStorage.removeItem('token')
                // 强制跳转登录页面
            location.href = '/login.html'
        }

    }
})