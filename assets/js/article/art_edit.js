$(function() {
    var layer = layui.layer
    var form = layui.form
    initCate()
        // 初始化富文本编辑器
    initEditor()
        // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // layer.msg('获取文章列表成功！')
                // 调用模板引擎 ，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name= cate_id]').html(htmlStr)
                    // 一定要记得调用 form.render() 方法-layui重新渲染结构
                form.render()
            }
        })
    }

    // 初始化图片裁剪器
    var $image = $('#image')
        // 裁剪选项
    var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview',

        }
        // 初始化裁剪区域
    $image.cropper(options)
        // 为选择封面按钮绑定点击事件
    $('#btnChooseImage').on('click', function(e) {
            $('#coverFile').click()

        })
        // 监听 coverFile 的 change 事件，获取用户选择文件列表
    $('#coverFile').on('change', function(e) {
            // 更换裁剪图片，创建对应的URL地址-销毁旧裁剪区-重新设置图片路径-创建新的裁剪区域-输出为文件
            // 获取文件的列表数组
            var files = e.target.files
                // 判断用户是否选择文件
            if (files.lenth === 0) {
                return
            }
            var newImgURL = URL.createObjectURL(files[0])
            $image.cropper('destroy').attr('src', newImgURL).cropper(options)

        })
        // 定义文章的发布状态
    var art_state = '已发布'
        // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
            art_state = '草稿'
        })
        // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function(e) {
            e.preventDefault()
                // 基于form表单 快速创建 FormData 对象
                // 通过[0]的形式将 jQuery 对象转换为原生 DOM元素 对象
            var fd = new FormData($(this)[0])
                // 追加文章发布状态到 FormData 对象中
            fd.append('state', art_state)
                // 循环展示该对象的键值对
                // fd.forEach(function(v, k) {
                //     console.log(k, v)
                // })
                // 将裁剪后的图片，输出为文件
            $image.cropper('getCroppedCanvas', {
                // 创建一个Canvas画布
                width: 400,
                height: 280
                    // 将Canvas 画布上的内容，转化为文件对象
            }).toBlob(function(blob) {
                // 将文件对象存储到 fd 中
                fd.append('cover_img', blob)
                    // 发起ajax数据请求
                publishArticle(fd)

            })
        })
        // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：向服务器提交FormData格式的数据必须添加一下两个配置项
            content: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                    // 发布文章成功后跳转到文章列表页
                location.href = '/article/art_list.html '
            }
        })
    }


})