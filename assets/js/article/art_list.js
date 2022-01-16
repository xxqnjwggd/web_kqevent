$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
        // 定义美化时间过滤器
    template.defaults.imports.dataFormat = function(date) {
            const dt = new Date(date)
            var y = dt.getFullYear()
            var m = padZero(dt.getMonth() + 1)
            var d = padZero(dt.getDate())
            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())
            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
        }
        // 定义补0
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，请求数据是将此对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认显示2条
        cate_id: '', //文章分类ID
        state: '', //文章的发布状态
    }
    initTable()
    initCate()
        // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // console.log(res)
                // 使用模板引擎渲染数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                    // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    // 筛选表单绑定 submit 事件
    $('#form-search').on('submit', function(e) {
            e.preventDefault()
                // 获取表单中选中项的值
            var cate_id = $['[name=cate_id]'].val()
            var state = $['[name=state]'].val()
                // 查询参数对象q对应的属性赋值
            q.cate_id = cate_id
            q.state = state
                // 根据最新的筛选重新渲染表格数据
            initTable()

        })
        // 定义渲染分页的方法
    function renderPage(total) {
        // 执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //分页容器Id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调：-点击页码和调用renderPage方法也会触发，会导致死循环
            //  first 参数的作用是，点击页码触发Jump 会返回undifined，调用render 方法返回true 
            jump: function(obj, first) {
                // 把最新的页码值，赋值到 q 的查询参数对象中
                q.pagenum = obj.curr
                    // 把最新的条目数，赋值到 q 的查询参数对象中
                q.pagesize = obj.limit
                    // 根据最新的 q 获取对应的数据列表，并渲染数据
                    // 防止死循环
                if (!first) {
                    initTable()
                }

            }
        })

    }
    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
            // 询问用户是否要删除数据
            layer.confirm('确认删除此文章？', { icon: 3, title: '提示' }, function(index) {
                // 获取删除按钮的个数
                var len = $('.btn-delete').length
                $.ajax({
                    method: 'GET',
                    url: '/my/article/delete' + id,
                    success: function(res) {
                        if (res.status !== 0) {
                            return layer.msg('删除文章失败！')
                        }
                        layer.msg("删除文章成功！")
                            // 当数据删除完成后，需判断当前这一页是否还有剩余数据，如果没有让页码值-1再调用 initTable方法
                        if (len === 1) {
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                        }
                        initTable()
                    }
                })
                layer.close(index)
            })
        })
        // 编辑文章代码段--无文章无法展现效果--代码中断
    $('.btn-edit').on('click', function() {
        alert(1)
        var id = $(this).attr('data-id')

        $('#art-edit').css('display', 'show')
        $.ajax({
                method: 'GET',
                url: '/my/article/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('获取失败!')
                    }
                    // console.log(res)
                    form.val('form-edit', res.data)
                }
            })
            // $('#art-list').css('display', 'none')


    })
})