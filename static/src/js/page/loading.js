require('../../sass/basic.scss');

var React = require('react'),
    ReactDOM = require('react-dom'),
    Loading = require('../component/Loading'); //这是组件模块，下一步要写的东西

var wrap = document.querySelector('.wrap'),

    hideCallback = function () {  //卸载组件后的回调
        alert('done!!');
    };

ReactDOM.render(
    <Loading content='哈喽' onHide={hideCallback}/>,
    wrap
);

setTimeout(function () { //3秒后卸载组件，模拟触发回调
    ReactDOM.unmountComponentAtNode(wrap)
}, 5000);