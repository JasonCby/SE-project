/**
 * @description: 根据上家的出牌，对玩家手中的牌进行动态规划
 * 
 * @param: nowpoker `array` 数组，上家的出牌
 *
 * @param: myallpoker `array` 数组，玩家中所有的牌
 */

function aiPlanning (nowpoker, myallpoker) {
  /**
   * 扑克牌的输入规则 { value: number, type: number }
   * 1：A，2：2，13：K，14：A，53：小王，54：大王
   * value 扑克牌内容
   * type 扑克牌的花色
   */
  const cardMapping = {
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    11: 11, // 'J',
    12: 12, // 'Q',
    13: 13, // 'K',
    14: 1,  // 'A',
    15: 2,  // '2',
    16: 53,
    17: 54,
  }

  /**
   * 扑克牌的输出规则
   */
  const planMapping =  {
    1: '3',
    2: '4',
    3: '5',
    4: '6',
    5: '7',
    6: '8',
    7: '9',
    8: '10',
    9: '11', // J
    10: '12', // Q
    11: '13', // K
    12: '14', // A
    13: '15', // 2
    14: 'KING',
  }

  //=============================================== 元素重定向

  let history = myallpoker; // 缓存原有变量

  nowpoker = !nowpoker[0] ? [] : nowpoker.map(e => cardMapping[e.value]);

  myallpoker = !myallpoker[0] ? [] : myallpoker.map(e => cardMapping[e.value]);

  //=============================================== 遍历

  var len1=nowpoker.length;

  var len2=myallpoker.length;

  //【等级化：】 [1->K 变为 3->K->2],[有色变无色],[53||54->14]
  for(var i=0;i<=len1-1;i++){
    if(nowpoker[i]>=53)nowpoker[i]=14;else{
        nowpoker[i]=((nowpoker[i]-1)%13+1)-2;
      if(nowpoker[i]<=0)nowpoker[i]+=13;
    }
  }

  for(var i=0;i<=len2-1;i++){
    if(myallpoker[i]>=53)myallpoker[i]=14;else{
        myallpoker[i]=((myallpoker[i]-1)%13+1)-2;
      if(myallpoker[i]<=0)myallpoker[i]+=13;
    }
  }

  //统计每个size的数量:
  var paisum=new Array(15);
  for(var i=1;i<=14;i++)paisum[i]=0;
  for(var i=0;i<=myallpoker.length-1;i++)paisum[myallpoker[i]]++;
  //统计每个size的数量end

  //排序：
  for(var i=0;i<=len1-1-1;i++) {
    for(var j=i+1;j<=len1-1;j++)
      if(nowpoker[i]>nowpoker[j]){
        var h=nowpoker[i];
        nowpoker[i]=nowpoker[j];
        nowpoker[j]=h;
      }
  }
  
  for(var i=0;i<=len2-1-1;i++) {
    for(var j=i+1;j<=len2-1;j++)
      if(myallpoker[i]>myallpoker[j]){
        var h=myallpoker[i];
        myallpoker[i]=myallpoker[j];
        myallpoker[j]=h;
      }
  }
  //排序结束

  //=============================================== UTILS

  function isZhaDan(poker){
    if(poker.length>=5||poker.length<=3)return false;
    if(poker[0]==poker[1]&&poker[1]==poker[2]&&poker[2]==poker[3])return true;
    return false;
  }
  function isHuoJian(poker){
    if(poker.length!=2)return false;
    if(poker[0]==14&&poker[1]==14)return true;
    return false;
  }
  function isDanPai(poker){
    if(poker.length==1)return true;
    return false;
  }
  function isDuiZi(poker){
    for(var i=0;i<=poker.length-1;i++)if(poker[i]==14)return false;
    if(poker.length!=2)return false;
    if(poker[0]==poker[1])return true;
    return false;
  }
  function isSanZhang(poker){
    for(var i=0;i<=poker.length-1;i++)if(poker[i]==14)return false;
    if(poker.length!=3)return false;
    if(poker[0]==poker[1]&&poker[1]==poker[2])return true;
    return false;
  }
  function isDanShun(poker){
      for(var i=0;i<=poker.length-1;i++)if(poker[i]==14)return false;
      if(poker.length<=4)return false;
    var is_=true;
    for(var i=0;i<=poker.length-1-1;i++)
      if(poker[i+1]-poker[i]==1){}else{
        is_=false;
      }
    return is_;
  }
  function isShuangShun(poker){
    for(var i=0;i<=poker.length-1;i++)if(poker[i]==14)return false;
    if(poker.length%2!=0||poker.length<=5)return false;
    for(var i=0;i<=poker.length/2-1;i++){
      if(poker[i*2]!=poker[i*2+1])return false;
    }
    for(var i=0;i<=poker.length/2-1-1;i++){
      if(poker[i*2]+1!=poker[i*2+2])return false;
    }
    return true;
  }
  function isSanShun(poker){
    for(var i=0;i<=poker.length-1;i++)if(poker[i]==14)return false;
    if(poker.length%3!=0||poker.length<=5)return false;
    for(var i=0;i<=poker.length/3-1;i++){
      if(poker[i*3]!=poker[i*3+1])return false;
    }
    for(var i=0;i<=poker.length/3-1-1;i++){
      if(poker[i*3]+1!=poker[i*3+3])return false;
    }
    return true;
  }
  function isSanDaiYi(poker){
    for(var i=0;i<=poker.length-1;i++)if(poker[i]==14)return -1;
    if(poker.length>=6||poker.length<=3)return -1;
    if(poker.length==4){
      if(poker[0]==poker[1]&&poker[1]==poker[2]&&poker[2]!=poker[3])return poker[0];
      if(poker[0]!=poker[1]&&poker[1]==poker[2]&&poker[2]==poker[3])return poker[3];
    }
    if(poker.length==5){
      if(poker[0]==poker[1]&&poker[1]==poker[2]&&poker[2]!=poker[3]&&poker[3]==poker[4])return poker[0];
      if(poker[0]==poker[1]&&poker[1]!=poker[2]&&poker[2]==poker[3]&&poker[3]==poker[4])return poker[4];
    }
    return -1;
  }
  function isFeiJi(poker){
    for(var i=0;i<=poker.length-1;i++)if(poker[i]==14)return -1;
    //统计每个size的数量
    //for(var i=0;i<=poker.length-1;i++)console.log("----"+i+"--pai-->"+poker[i]);
    var pai=new Array(13);for(var i=0;i<=12;i++)pai[i]=0;
    for(var i=0;i<=poker.length-1;i++)pai[poker[i]-1]++;
    //for(var i=0;i<=12;i++)console.log("----"+i+"--sum-->"+pai[i]);
    //取三张里的最大和最小size，记录几个三张。max-min=sum-1>=2 对，否则不是三顺
    var max=-10;
    var min=15;
    var sum=0;
    for(var i=0;i<=12;i++)if(pai[i]==3){
      if(i+1>max)max=i+1;
      if(i+1<min)min=i+1;
      sum++;
    }
    //console.log("max="+max);
    //console.log("min="+min);
    //console.log("sum="+sum);
    if(max-min==sum-1&&sum>=2){}else return -1;
    //console.log("function FeiJi: san shun true");
    //有单也有双，错
    var sum1=0;
    var sum2=0;
    for(var i=0;i<=12;i++){
      if(pai[i]==2)sum2++;
      if(pai[i]==1)sum1++;
    }
    if(sum2==0&&sum1==0)return -1;
    if(sum2!=0&&sum1!=0)return -1; 
    //判断单双的数量对否
    if(sum1!=0&&sum2==0)if(sum1!=sum)return -1;
    if(sum2!=0&&sum1==0)if(sum2!=sum)return -1;
    //console.log("function FeiJi: end is true");
    //------------------------
    return min*100+max;
  }

  //=============================================== 元素排列返回

  function returnPoker(list) {
    if (!list[0]) return [];

    const result = list.map(e => {
      const planItem = planMapping[e];

      // 大小王
      if (planItem === 'KING') {
        const index = history.findIndex(l => +l.value === 16 || +l.value === 17);
        const historyItem = history[index];
        history.splice(index, 1);
        return historyItem;
      }

      // 普通牌
      else {
        const index = history.findIndex(l => +l.value === +planItem);
        const historyItem = history[index];
        history.splice(index, 1);
        return historyItem;
      }

    });

    return result;
  }

  //=============================================== 逻辑BEGIN


  if (nowpoker.length===0){
    return returnPoker([myallpoker[0]]);
  }
  if(isHuoJian(nowpoker)){
    var a=new Array(0);
    return returnPoker(a);
  }
  if(isZhaDan(nowpoker)){
    console.log("if nowpoker is 炸弹（可能AI会不跟炸弹）");
    //是否出炸弹:
    if(Math.random()<0.5){//随机确定  出炸弹火箭系列 or 不出牌
    for(var i=1;i<=14;i++){
      if(paisum[i]==4&&i>nowpoker[0]){//出炸弹
        var a=new Array(4);
        for(var j=0;j<=3;j++)a[j]=i;
        return returnPoker(a);
      }
    }
    if(paisum[14]==2){//出火箭
      var a=new Array(2);
      for(var j=0;j<=1;j++)a[j]=14;
      return returnPoker(a);
    }
    }
    //是否出炸弹end
    //不出牌:
    var a=new Array(0);
    return returnPoker(a);
  }
  if(isDanPai(nowpoker)){
    console.log("if nowpoker is 单牌");
    for(var i=1;i<=14;i++){//从单牌中找牌
      if(paisum[i]==1&&i>nowpoker[0]){
        var a=new Array(1);
        a[0]=i;
        console.log("AI策略：从单牌中找牌 :"+ planMapping[i]);
        return returnPoker(a);
      }
    }
    for(var i=1;i<=14;i++){//从对子或三张中取出单牌
      if(paisum[i]>=2&&paisum[i]<=3&&i>nowpoker[0]){
        var a=new Array(1);
        a[0]=i;
        console.log("AI策略：从对子或三张中取出单牌 :"+planMapping[i]);
        return returnPoker(a);
      }
    }
    //是否出炸弹:
    if(Math.random()<0.5){//随机确定  出炸弹火箭系列 or 不出牌
    for(var i=1;i<=14;i++){
      if(paisum[i]==4){//出炸弹
        var a=new Array(4);
        for(var j=0;j<=3;j++)a[j]=i;
        return returnPoker(a);
      }
    }
    if(paisum[14]==2){//出火箭
      var a=new Array(2);
      for(var j=0;j<=1;j++)a[j]=14;
      return returnPoker(a);
    }
    }
    //是否出炸弹end
    var a=new Array(0);
    return returnPoker(a);
  }
  if(isDuiZi(nowpoker)){
    console.log("if nowpoker is 对子");
    for(var i=1;i<=14;i++){//从对子中选对子
      if(paisum[i]==2&&i>nowpoker[0]){
        var a=new Array(2);
        a[0]=i;a[1]=i;
        console.log("AI策略：从对子中选对子 :"+planMapping[i]);
        return returnPoker(a);
      }
    }
    for(var i=1;i<=14;i++){//从三张中取出对子
      if(paisum[i]==3&&i>nowpoker[0]){
        var a=new Array(2);
        a[0]=i;a[1]=i;
        console.log("AI策略：三张中取出对子 :"+planMapping[i]);
        return returnPoker(a);
      }
    }
    //是否出炸弹:
    if(Math.random()<0.5){//随机确定  出炸弹火箭系列 or 不出牌
    for(var i=1;i<=14;i++){
      if(paisum[i]==4){//出炸弹
        var a=new Array(4);
        for(var j=0;j<=3;j++)a[j]=i;
        return returnPoker(a);
      }
    }
    if(paisum[14]==2){//出火箭
      var a=new Array(2);
      for(var j=0;j<=1;j++)a[j]=14;
      return returnPoker(a);
    }
    }
    //是否出炸弹end
    var a=new Array(0);
    return returnPoker(a);
  }
  if(isSanZhang(nowpoker)){
    for(var i=1;i<=14;i++){//从三张中选三张
      if(paisum[i]==3&&i>nowpoker[0]){
        var a=new Array(3);
        a[0]=i;a[1]=i;a[2]=i;
        return returnPoker(a);
      }
    }
    //是否出炸弹:
    if(Math.random()<0.5){//随机确定  出炸弹火箭系列 or 不出牌
    for(var i=1;i<=14;i++){
      if(paisum[i]==4){//出炸弹
        var a=new Array(4);
        for(var j=0;j<=3;j++)a[j]=i;
        return returnPoker(a);
      }
    }
    if(paisum[14]==2){//出火箭
      var a=new Array(2);
      for(var j=0;j<=1;j++)a[j]=14;
      return returnPoker(a);
    }
    }
    //是否出炸弹end
    //不出：
    var a=new Array(0);
    return returnPoker(a);
  }
  if(isDanShun(nowpoker)){
    //从王牌前的非炸弹中选顺子：
    for(var i=nowpoker[0]+1;i<=13-(nowpoker.length-1);i++){
      var is_=true;
      for(var j=1;j<=nowpoker.length;j++)if(paisum[i+j-1]<1||paisum[i+j-1]>3)is_=false;
      if(is_){
        var a=new Array(nowpoker.length);
        for(var j=1;j<=nowpoker.length;j++)a[j-1]=i+j-1;
        return returnPoker(a);
      }
    }
    //是否出炸弹:
    if(Math.random()<0.5){//随机确定  出炸弹火箭系列 or 不出牌
    for(var i=1;i<=14;i++){
      if(paisum[i]==4){//出炸弹
        var a=new Array(4);
        for(var j=0;j<=3;j++)a[j]=i;
        return returnPoker(a);
      }
    }
    if(paisum[14]==2){//出火箭
      var a=new Array(2);
      for(var j=0;j<=1;j++)a[j]=14;
      return returnPoker(a);
    }
    }
    //是否出炸弹end
    //不出：
    var a=new Array(0);
    return returnPoker(a);
  }
  if(isShuangShun(nowpoker)){
    //从王牌前的长度2~3中选2顺：
    for(var i=nowpoker[0]+1;i<=13-(nowpoker.length/2-1);i++){
      var is_=true;
      for(var j=1;j<=nowpoker.length/2;j++)if(paisum[i+j-1]<=1||paisum[i+j-1]>=4)is_=false;
      if(is_){
        var a=new Array(nowpoker.length);
        for(var j=1;j<=nowpoker.length/2;j++){
          a[j*2-2]=i+j-1;
          a[j*2-1]=i+j-1;
        }
        return returnPoker(a);
      }
    }
    //是否出炸弹:
    if(Math.random()<0.5){//随机确定  出炸弹火箭系列 or 不出牌
    for(var i=1;i<=14;i++){
      if(paisum[i]==4){//出炸弹
        var a=new Array(4);
        for(var j=0;j<=3;j++)a[j]=i;
        return returnPoker(a);
      }
    }
    if(paisum[14]==2){//出火箭
      var a=new Array(2);
      for(var j=0;j<=1;j++)a[j]=14;
      return returnPoker(a);
    }
    }
    //是否出炸弹end
    //不出：
    var a=new Array(0);
    return returnPoker(a);
  }
  if(isSanShun(nowpoker)){
    //从王牌前的长度3中选3顺：
    for(var i=nowpoker[0]+1;i<=13-(nowpoker.length/3-1);i++){
      var is_=true;
      for(var j=1;j<=nowpoker.length/3;j++)if(paisum[i+j-1]<=2||paisum[i+j-1]>=4)is_=false;
      if(is_){
        var a=new Array(nowpoker.length);
        for(var j=1;j<=nowpoker.length/3;j++){
          a[j*3-3]=i+j-1;
          a[j*3-2]=i+j-1;
          a[j*3-1]=i+j-1;
        }
        return returnPoker(a);
      }
    }
    //是否出炸弹:
    if(Math.random()<0.5){//随机确定  出炸弹火箭系列 or 不出牌
    for(var i=1;i<=14;i++){
      if(paisum[i]==4){//出炸弹
        var a=new Array(4);
        for(var j=0;j<=3;j++)a[j]=i;
        return returnPoker(a);
      }
    }
    if(paisum[14]==2){//出火箭
      var a=new Array(2);
      for(var j=0;j<=1;j++)a[j]=14;
      return returnPoker(a);
    }
    }
    //是否出炸弹end
    //不出：
    var a=new Array(0);
    return returnPoker(a);
  }
  if(isSanDaiYi(nowpoker)!=-1){
    for(var i=1;i<=14;i++){
      if(paisum[i]==3&&i>isSanDaiYi(nowpoker)){//找三张
        if(nowpoker.length==5){
          for(var j=1;j<=14;j++)if(paisum[j]==2){//找对子
            var a=new Array(5);
                a[0]=i;a[1]=i;a[2]=i;
            a[3]=j;a[4]=j;
                return returnPoker(a);
          }
          for(var j=1;j<=14;j++)if(paisum[j]==3&&j!=i){//找三张取出对子
            var a=new Array(5);
                a[0]=i;a[1]=i;a[2]=i;
            a[3]=j;a[4]=j;
                return returnPoker(a);
          }
        }
        if(nowpoker.length==4){
          for(var j=1;j<=14;j++)if(paisum[j]==1){//找单牌
            var a=new Array(4);
                a[0]=i;a[1]=i;a[2]=i;
            a[3]=j;
                return returnPoker(a);
          }
          for(var j=1;j<=14;j++)if(paisum[j]==2){//找对子取出单牌
            var a=new Array(4);
                a[0]=i;a[1]=i;a[2]=i;
            a[3]=j;
                return returnPoker(a);
          }
          for(var j=1;j<=14;j++)if(paisum[j]==3&&i!=j){//找三张取出单牌
            var a=new Array(4);
                a[0]=i;a[1]=i;a[2]=i;
            a[3]=j;
                return returnPoker(a);
          }
        }
      }
    }
    //是否出炸弹:
    if(Math.random()<0.5){//随机确定  出炸弹火箭系列 or 不出牌
    for(var i=1;i<=14;i++){
      if(paisum[i]==4){//出炸弹
        var a=new Array(4);
        for(var j=0;j<=3;j++)a[j]=i;
        return returnPoker(a);
      }
    }
    if(paisum[14]==2){//出火箭
      var a=new Array(2);
      for(var j=0;j<=1;j++)a[j]=14;
      return returnPoker(a);
    }
    }
    //是否出炸弹end
    //不出：
    var a=new Array(0);
    return returnPoker(a);
  }
  if(isFeiJi(nowpoker)!=-1){
    var get_=isFeiJi(nowpoker);
    var min=parseInt(get_/100);//三顺的最小size
          var max=get_%100;			//三顺的最大size
    var len_small=(nowpoker.length-(max-min+1)*3)/(max-min+1);//附带牌是单还是双
    //从王牌前的长度3中选3顺：
    for(var i=min+1;i<=13-(max-min);i++){//找开头
      var is_=true;
      for(var j=1;j<=(max-min+1);j++)if(paisum[i+j-1]<=2||paisum[i+j-1]>=4)is_=false;//找三顺
      if(is_){//如果三顺找到了
        var sum=0;//表示附带牌的总数
        var a=new Array(nowpoker.length);
        for(var j=1;j<=13;j++)
          if(paisum[j]==len_small//从单牌中拿单牌，从对子中拿对子
            ||(paisum[j]>len_small&&paisum[j]<=3&&(j<i||j>i+max-min))//从2或3中拿单牌，从3中拿对子
          )//找附带
          {
            for(var f=1;f<=len_small;f++)
            {
              sum++;
                if(sum/len_small<=max-min+1)a[sum-1]=j;//先在输出数组中放入附带牌，数量等于len_small*(max-min+1)
            }
          }
        if(sum/len_small>=max-min+1){//如果附带找齐了
          for(var j=1;j<=max-min+1;j++){
              a[(max-min+1)*len_small+j*3-3]=i+j-1;//在附带牌的后面加上三顺，(max-min+1)*len_small是附带牌的占位
              a[(max-min+1)*len_small+j*3-2]=i+j-1;
              a[(max-min+1)*len_small+j*3-1]=i+j-1;
            }
            return returnPoker(a);
        }
      }
    }
    //是否出炸弹:
    if(Math.random()<0.5){//随机确定  出炸弹火箭系列 or 不出牌
    for(var i=1;i<=14;i++){
      if(paisum[i]==4){//出炸弹
        var a=new Array(4);
        for(var j=0;j<=3;j++)a[j]=i;
        return returnPoker(a);
      }
    }
    if(paisum[14]==2){//出火箭
      var a=new Array(2);
      for(var j=0;j<=1;j++)a[j]=14;
      return returnPoker(a);
    }
    }
    //是否出炸弹end
    //不出：
    var a=new Array(0);
    return returnPoker(a);
  }

}

module.exports = { aiPlanning };

// const demoDanNow = [{ value: 3, type: 0 }];
// const demoDanMe = [{ value: 5, type: 3 }, { value: 6, type: 1 }];

// const demoShuang = [{ value: 3, type: 0 }, { value: 3, type: 1 }];
// const demoShuangMe1 = [{ value: 10, type: 2 }, { value: 10, type: 1 }];
// const demoShuangMe2 = [{ value: 16, type: 0 }, { value: 17, type: 0 }];

// const result1 = aiPlanning(demoDanNow, demoDanMe);
// const result2 = aiPlanning(demoShuang, demoShuangMe1);
// const result3 = aiPlanning(demoShuang, demoShuangMe2);

// console.log(`${JSON.stringify(result1)}\n${JSON.stringify(result2)}\n${JSON.stringify(result3)}\n`);