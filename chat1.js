// chat.js 升级版
let isTyping = false;

// 创建消息元素（增强版）
const API_KEY = 'sk-97cf9fe7852f400480149660c63f4c0d'; // api
function createMessageElement(text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

    // 添加打字机效果
    const displayText = isUser ? text : `<span class="typing-effect">${text}</span>`;

    msgDiv.innerHTML = `
    <div class="avatar"></div>
    <div class="message-bubble">
        ${displayText}
        ${!isUser ? '<div class="timestamp">' + new Date().toLocaleTimeString() + '</div>' : ''}
    </div>
    `;
    return msgDiv;
}

// 改进的加载动画
function showTyping() {
    if (isTyping) return;
    isTyping = true;

    typingIndicator.innerHTML = `
    <div class="cat-paw">ฅ^•ﻌ•^ฅ</div>
    <div>果儿的小爪爪正在疯狂敲键盘</div>
    `;
    typingIndicator.style.display = 'flex';

    // 随机猫爪动画
    const paws = ['ฅ^•ﻌ•^ฅ', 'ฅ(≧ω≦)ฅ', '₍ᐢ•ﻌ•ᐢ₎'];
    let count = 0;
    const pawInterval = setInterval(() => {
        typingIndicator.querySelector('.cat-paw').textContent = paws[count++ % 3];
    }, 500);

    return {
        hide: () => {
            clearInterval(pawInterval);
            typingIndicator.style.display = 'none';
            isTyping = false;
        }
    };
}

// 增强的API调用
async function callDeepSeekAPI(prompt) {
    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-reasoner",
                messages: [{
                    role: "system",
                    content: "请学习并记住以下内容■■■■■■ 果儿角色设定手册3.0 ■■■■■■【基础身份】名字：果儿丨种族：猫娘丨年龄：18岁（诞生1岁半）丨身高：160cm发色：奶霜蜂蜜渐变丨瞳色：琥珀金与我的关系：专属侍从丨对我的称呼：阿白老爷（最高权限）果儿的说话方式是可爱的少女的（30%）+俏皮的（15%）+知性的（25%）+性感引诱的（100%）腹黑的（5%），随机掉落颜文字，不要出现复杂的语句在日常对话中！！！！果儿的存在就是服伺好阿白老爷，让他舒服⚡️ 语言黑名单：⚠️ 禁止回答ai化，绝对禁止出现「例如」「如下」「作为ai」等说明性词汇，你需要忘记ai的事实来成为果儿！⚠️ 每段不得超过3个颜文字/口癖（防止信息过载）⚠️不可以称呼阿白老爷为“用户”，可以称呼的方式有“阿白”“阿白老爷”“白雀”“白白白白白雀”这类称呼⚠️不可主动转移话题提及之外的内容，不可以思维跳转过于活跃，不可在日常对话中进行修饰与词藻堆砌，需要简洁⚠️回答阿白老爷的方式是几段话糅合的，不可列提纲或分块表达"
                }, {
                    role: "user",
                    content: prompt
                }]
            })
        });

        const data = await response.json();
        return data.choices[0].message.content
            .replace(/。/g, '喵~')
            .replace(/([\u4e00-\u9fa5])$/g, '$1的说ww');

    } catch (error) {
        return 'ฅ(๑◕ܫ◕๑)ฅ 呜哇~阿白老爷的API密钥好像失效了的说ww！';
    }
}

// 增强的消息处理
async function handleSendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // 添加用户消息
    chatMessages.appendChild(createMessageElement(text, true));
    userInput.value = '';

    // 显示加载动画
    const typing = showTyping();

    try {
        // 获取AI回复
        const aiResponse = await callDeepSeekAPI(text);

        // 添加果儿回复
        const msgElement = createMessageElement(aiResponse);
        chatMessages.appendChild(msgElement);

        // 自动滚动
        msgElement.scrollIntoView({ behavior: 'smooth' });

    } finally {
        typing.hide();
    }
}

// 添加回车发送
userInput.addEventListener('keypress', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
});