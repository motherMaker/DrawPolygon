# DrawPolygon
### 使用vue + vuex 实现的一个描多边形的页面
 本人这几个月一直学习vue和vue有关的知识,公司又因为有项目需求,如果我自己一个人慢慢用DW描点的话,浪费太多资源,所以本人就抽空写了这个插件,主要功能就是用来描制多边形的。以后还会有更新,包括界面上和操作上面的优化。希望各位大佬不吝赐教。

<h3>使用步骤</h3>

```
#step1
git clone git@https://github.com/vien-li/DrawPolygon.git

#step2
npm i 

#step3
npm run dev

#build
npm run build

```

<h3>技术栈</h3>

<h5>Vue2.0</h5>

<h5>vue-router</h5>

<h5>vuex</h5>

<h5>iView https://www.iviewui.com/</h5>

<h3>实现功能</h3>

<h5>1:绘制多边形功能</h5> 

<h5>2.重命名、撤回功能</h5>

<h5>3.图片和svg放大缩小功能</h5>


<h3>遇到问题:</h3>

<h5>1：每次鼠标点击之后设置了对象的值，但是总是不能动态的改变polygon标签的points属性。最后综合了众多的解决方案之后选择了将遍历对象放在computed中，这样每次动态添加属性值就会重新渲染。</h5>

<h5>2：npm run build 之后页面出现 404 。解决方案：将webpack.prod.config.js里面的 publicPath: '/dist/' 改成 './dist/',并且将路由设置成hash模式（mode为 'history'会找不到界面）,如果一定要用history模式,需要在每个路由之前添加自己的项目名</h5>


