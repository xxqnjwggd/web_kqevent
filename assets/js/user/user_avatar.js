$(function() {
    var layer = layui.layer
        // 实现基本剪裁效果
    var $image = $('#image')
        // 配置选项
    const options = {
            // 纵横比
            aspectRatio: 1,
            // 指定预览区域
            preview: '.img-preview'
        }
        // 创建剪裁区域
    $image.cropper(options)

    // 上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function() {

        $('#file').click()

    })

    // 为文件选择框绑定 change 事件
    $('#file').on('change', function(e) {
        // 获取用户选择的文件
        var filelist = e.target.files
        if (filelist.length === 0) {
            return layer.msg('请选择图片！')
        }
        // 拿到用户选择的文件
        var file = e.target.files[0]
            // 将文件转化为路径
        var imgURL = URL.createObjectURL(file)
            // 重新初始化裁剪区-销毁旧的裁剪区域-重新设置图片路径-重新初始化裁剪区域
        $image.cropper('destroy').attr('src', imgURL).cropper(options)
    })

    // 点击确定上传服务器
    $('#btnUpload').on('click', function() {
        // 将裁剪后的图片，输出为 base64 格式的字符串
        var dataURL = $image.cropper('getCroppedCanvas', { width: 100, height: 100 }).toDataURL('image/png')
            //    调用接口把头像上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更改头像失败！')
                }
                layer.msg('更改头像成功！')
                window.parent.getUserInfo()
            }
        })
    })
})