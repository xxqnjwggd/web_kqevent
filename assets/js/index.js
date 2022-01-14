$(function() {
        // 调用 getUserInfo 函数获取用户基本信息
        getUserInfo()
            // 点击按钮，实现退出功能
        var layer = layui.layer
        $('#btnLogout').on('click', function() {
            layer.confirm('确定退出登录', { icon: 3, title: '提示' },

                function(index) {
                    // 清空本地存储中的 token
                    localStorage.removeItem('token')
                        // 重新跳转到登录页
                    location.href = '/login.html'
                        // 关闭 confirm 询问框
                    layer.close(index)
                })

        })
    })
    // 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //  headers 请求头配置对象,已经在 baseAPI 中配置
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        },
        // 不论结果如何，始终会调用 complete 回调函数
        // complete: function(res) {
        //     // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 强制清空 token 
        //         localStorage.removeItem('token')
        //             // 强制跳转登录页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}
// 渲染用户的头像
function renderAvatar(user) {
    // 获取用户名称
    var name = user.nickname || user.username
        // 设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        // 按需渲染用户头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}