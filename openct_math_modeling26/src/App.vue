<template>
  <div class="row" id="row" v-loading="loading1">
    <!-- 这里的左右div是反的 新版本 -->
    <div class="right" id="right">
        <span style="float:left;border:2px solid #ccc;">时间：{{timeshow}}</span>
        <div class="tip">任务区</div>
        <div class="rightContainer">
          <div class="problem" v-html="question.title" style="font-weight:700"></div>
          <div class="problem" v-html="question.contextHtml"></div>
        </div>
        <div class="qytip"> 
          提示:<br />
          1.点击右上方<b>总览区</b>的表格选取题目；<br />
          2.点击右下方<b>答题区</b>选择你的答案；<br />
          3.作答时间达75分钟自动提交<br />
        </div>
        <!-- <div class="right_title">{{getRightTitle()}}</div> -->
    </div>
    <div id="resizebar" ></div>
    <div class="left" id="left">
      <!-- <p style="font-weight:700;font-size:1.1em">建 模 过 程</p> -->
      <div class="tip" style="">总览区</div>
      <div class="resulttable">
        <table class="table">
            <td>
              <tr>&nbsp;</tr>
              <tr><el-button type="primary">目标定向</el-button></tr> <!--area=1-->
              <tr><el-button type="primary">问题驱动</el-button></tr>
              <tr><el-button type="primary">数学推理</el-button></tr>
              <tr><el-button type="primary">结果表达</el-button></tr>
            </td>
            <td v-for="step in result.dataJson" :key="step.id">
              <tr>{{step.context}}</tr>
              <tr @click="alertoption(step.context,1,step.id,'a',step)">
                 <el-tooltip :open-delay="500" class="item" effect="light" placement="top-start">
                  <div slot="content" v-html="step.a"></div>
                  <el-button :type="finishedabcd(step,'a')?'success':'info'">{{findquestionflag(step,'a')}}</el-button>
                </el-tooltip>
              </tr>
              <tr @click="alertoption(step.context,2,step.id,'b',step)">
                 <el-tooltip :open-delay="500" class="item" effect="light" placement="top-start">
                   <div slot="content" v-html="step.b"></div>
                  <el-button :type="finishedabcd(step,'b')?'success':'info'">{{findquestionflag(step,'b')}}</el-button>
                </el-tooltip>
              </tr>
              <tr @click="alertoption(step.context,3,step.id,'c',step)">
                 <el-tooltip :open-delay="500" class="item" effect="light"  placement="top-start">
                   <div slot="content" v-html="step.c"></div>
                  <el-button :type="finishedabcd(step,'c')?'success':'info'">{{findquestionflag(step,'c')}}</el-button>
                </el-tooltip>
              </tr>
              <tr @click="alertoption(step.context,4,step.id,'d',step)">
                 <el-tooltip :open-delay="500" class="item" effect="light"  placement="top-start">
                   <div slot="content" v-html="step.d"></div>
                  <el-button :type="finishedabcd(step,'d')?'success':'info'">{{findquestionflag(step,'d')}}</el-button>
                </el-tooltip>
              </tr>
              <!-- <tr @click="alertoption(step.context,2,step.id,'b')">{{finishedabcd(step,'d')}}{{step.b}}</tr>
              <tr@click="alertoption(step.context,3,step.id,'c')" >{{finishedabcd(step,'c')}}{{step.c}}</tr>
              <tr@click="alertoption(step.context,4,step.id,'d')" >{{finishedabcd(step,'b')}}{{step.d}}</tr> -->
            </td>
         </table>
      </div>
      <!-- 空白 -->
      <div class="whiteline">
        &nbsp;
      </div>
      <!-- <h3 v-if="showsteps && !alertcurrentOpotion.length" class="left_title">为完成此任务，目前需要实现以下哪一项？</h3> -->
      <!-- 显示备修改选项 -->
      <!-- <div class="right_title">{{getRightTitle()}}</div> -->
      <div class="leftBottom">
        <div class="steps" v-if="alertcurrentOpotion.length">
          <h3 >{{findOptionTitle(this.alterArea,this.alterContext)}}</h3>
          <p :class="['stepitem', optionindex==index1?'active_step':'']" @click="changeOptionIndex(index1)"  v-for="(smalloption,index1) in alertcurrentOpotion" v-if="smalloption.content.indexOf('其它')==-1 && smalloption.content.indexOf('其他')==-1" :key="smalloption.id">
              <span  v-html="smalloption.content" style="font-weight:300;font-size:16px;font-family:'宋体';color:#000"></span>
          </p>
          <br />
          <el-button  @click="alertStepOption()" type="success" >确认</el-button>
        </div>
        <div v-else>
            <!-- 显示步骤{{result}} -->
            <div class="steps" v-if="showsteps">
              <!-- <p style="font-weight:600;font-size:18px;">要完成任务，目前需要实现以下哪一步？</p> -->
              <p :class="['stepitem', active_step_index==index?'active_step':'']" @click="change(index)" v-for="(step,index) in question.stepList" :key="step.id">{{selectTip(step.context)}}</p>
              <p v-if="result.dataJson.length==6">点击上方表格选择题目作答，若完成所有题目，则可点击下方按钮提交</p>
              <el-button v-if="result.dataJson.length!=6" @click="showOption()" type="primary" style="float:right;margin-top:5vh">下一步</el-button>
              <el-button v-else @click="submitResult()" type="success" style="float:right;margin-top:5vh">提交</el-button>
            </div>

            <!-- 显示选项 -->
            <div class="steps" v-if="!showsteps">
              <!-- 遍历一个步骤的四个大选项 -->
              <div v-show="areaIndex==options.area" v-for="(options,index) in currentOptions" :key="options.id">
                <h3 v-if="!showsteps" class="optionquestion">{{findOptionTitle(options.area,options.stage)}}</h3>
                <!--遍历每个大选项的小选项 {{options.area}}|{{options.stage}}|确定问题<br /> -->
                <p :class="['stepitem', optionindex==index1?'active_step':'']" @click="changeOptionIndex(index1)"  v-for="(smalloption,index1) in JSON.parse(options.content)" v-if="smalloption.content.indexOf('其它')==-1 && smalloption.content.indexOf('其他')==-1" :key="smalloption.id">
                  <i :class="['fa', optionindex==index1? 'fa-circle-o' : 'fa-circle-o']" ></i>&nbsp; <span  v-html="smalloption.content" style="font-weight:300;font-size:16px;font-family:'宋体';color:#000"></span>
                </p>
                <br />
                <!-- <p align="right"><el-button @click="changeAreaIndex()" type="primary" >下一步{{areaIndex}}</el-button></p> -->
                <p  style="display:inline-block;float:left"><el-button @click="changeAreaIndex(-1)" type="primary" >上一步</el-button></p>
                
                <p  style="display:inline-block;float:right"><el-button @click="changeAreaIndex(1)" type="primary" >下一步</el-button></p>
                <br /><br />
              </div>
              <!-- <el-button  type="primary" style="float:right;margin-top:15vh">下一步</el-button> -->
            </div>
            <br />
            <div class="tip" >答题区</div>
        </div>
      </div>
    </div>
    
  </div>
</template>
<script>
// import Ueditor from '@/components/studentthree/Ueditor.vue';
export default {
  components: {
        // Ueditor
    },
  data() {
    return {

      enterpageTime:'', //进入时间


      enterTime:0, //进入组件的时间

      showsteps:true, //true显示步骤 false步骤里面的选项
      
      active_step_index:0, //当前步骤的index
      currentStep:{}, //当前步骤
      currentOptions:[], //当前步骤对应的所有大选项
      areaIndex:1, //控制当前显示哪一个大选项 1-4
      optionindex:-1, //控制当前对应哪个小选项 

      loading1:true,
      question:[], //当前问题
      option:[], //这个问题的所有小问 24个 6个步骤*4
      questionId:'', //当前问题的id
      // leftList:[], //左边需要显示的列表

      result:{ //收集学生填写的信息 封装成结果
                questionId:'',
                userId:'',
                answer1:0,  //6个步骤和正确步骤匹配的个数
                answer2:0,  //修改选项的次数
                answer3:0,  //答题完了后修改选项的次数
                dataJson:[
                  // {
                  //     "id":470, //步骤id
                  //     "questionId":25, //问题id
                  //     "context":"识别信息",
                  //     "is_delete":0,
                  //     "a":"每只蚊子翅膀和触角长度的和",
                  //     "b":"A蚊B蚊翅膀和触角长度的平均值是多少？",
                  //     "c":"初步感知A蚊B蚊翅膀和触角长度的平均值",
                  //     "d":"可以计算得到每只蚊子翅膀和触角长度的差",
                  //     "a1":2,
                  //     "b1":3,
                  //     "c1":3,
                  //     "d1":4
                  // },
                  
                ],
         },
         //修改选项用
         curAlertstepId:'', //当前修改的结果的step.id
         curAlertstepabcd:'', //当前修改是step中abcd哪一个
         alertcurrentOpotion:[], //备修改的选项
         alterContext:'',
         alterArea:'',

         timeshow:'00:00:00', //作答时间显示
         interval:'',
    }
  },
  methods:{
    //点击表格后修改小选项 
    alertoption(context,area,curAlertstepId,abcd,currentStep){ //通过两个字段在24个找出选项 curAlertstepId为当前修改的结果的step.id
      this.currentStep = currentStep;
      console.log("alertoption")
      //元数据统计 修改次数
      this.result.answer2++;
      if(this.result.dataJson.length==6){
        this.result.answer3++;
      }
      console.log(context,area)
      this.curAlertstepId = curAlertstepId;
      this.alterContext = context;
      this.alterArea = area;
      this.curAlertstepabcd = abcd;
      for(let i=0; i<this.option.length; i++){
        if(context==this.option[i].stage && area==this.option[i].area){
          // this.option[i].content = JSON.stringify(JSON.parse(this.option[i].content)); //
          // currentOpotion.push(this.option[i]);
          this.optionindex = -1;
          console.log("找到修改的备选项",JSON.parse(this.option[i].content))
          this.alertchangoptionindex(area,JSON.parse(this.option[i].content))
          // this.alertcurrentOpotion = JSON.parse(this.option[i].content).sort(this.randomsort)
          this.alertcurrentOpotion = JSON.parse(this.option[i].content)
          return
        }
      }


    },

    alertchangoptionindex(area,options){
       //找回之前修改的
       console.log("找回之前修改的",options,area,this.currentStep)
      for(let i=0; i<options.length; i++){
        if(area==1 && this.currentStep.a==options[i].content ){
          console.log("找到了")
          this.optionindex = i;
        }else if(area==2 && this.currentStep.b==options[i].content){
          this.optionindex = i;
        }else if(area==3 && this.currentStep.c==options[i].content){
          this.optionindex = i;
        }else if(area==4 && this.currentStep.d==options[i].content){
          this.optionindex = i;
        }
      }
    },

    //确认修改
    alertStepOption(){
      if(this.optionindex==-1){
        this.errMsg("请选择一个选项");
        return
      }
      for(let i=0; i<this.result.dataJson.length; i++){
        if(this.result.dataJson[i].id==this.curAlertstepId){
          // console.log("要修改的",  this.result.dataJson[i][this.curAlertstepabcd]) //找到需要修改的result中
          this.result.dataJson[i][this.curAlertstepabcd] = this.alertcurrentOpotion[this.optionindex].content;
          this.result.dataJson[i][this.curAlertstepabcd+'1'] = this.alertcurrentOpotion[this.optionindex].grade;
          console.log("修改后的结果",this.result)
          this.optionindex = -1;
          this.alertcurrentOpotion = [];
          // this.showsteps = true;
          return 
        }
      }
      this.optionindex = -1;
    },
    showdata(){
      console.log(this)
    },
    //通过area和stage找出选项的提问 24种
    findOptionTitle(area,stage){
      if(stage=="识别信息"){
        if(area==1){
          return "阅读题目，你认为以下哪方面的信息最重要？";
        }else if(area==2){
          return "阅读题目过程中，你会提出以下哪个问题？";
        }else if(area==3){
          return "阅读题目过程中，通过以下哪项可以获取重要信息？";
        }else if(area ==4){
          return "阅读题目后，你认为以下哪项信息最重要？";
        }
      }else if(stage=="关系连接"){
        if(area==1){
          return "解决这个题目，你认为需要考虑哪些重要因素及其关系？";
        }else if(area==2){
          return "在确定重要因素及其关系前，你会提出以下哪一个问题？";
        }else if(area==3){
          return "你主要根据以下哪一项来确定重要因素及其关系？";
        }else if(area ==4){
          return "以下哪一条是你确定的重要因素及其关系？";
        }
      }else if(stage=="建立模型"){
        if(area==1){
          return "以下哪一条是你下一步将建立的数学式子的描述？";
        }else if(area==2){
          return "在建立数学式子前，你会提出以下哪一个问题？";
        }else if(area==3){
          return "你会用以下哪一条来建立此题的数学式子？";
        }else if(area ==4){
          return "解决这个问题，你需要建立以下哪一项数学式子？";
        }
      }else if(stage=="代入数据"){
        if(area==1){
          return "结合已知条件，你认为以下哪一项可以解决此具体问题？";
        }else if(area==2){
          return "依据已知条件解决具体问题，你会提出以下哪一个问题？";
        }else if(area==3){
          return "你依据以下哪一项来解决具体问题？";
        }else if(area ==4){
          return "代入情境已知条件后，以下哪一项式子是解决此具体问题的重要步骤？";
        }
      }else if(stage=="数学运算"){
        if(area==1){
          return "通过数学运算，你希望得到以下哪一项的结果？";
        }else if(area==2){
          return "在数学运算过程中，你最有可能提出以下哪一个问题？";
        }else if(area==3){
          return "你主要依据以下哪一项进行数学运算？";
        }else if(area ==4){
          return "通过数学运算，你得到以下哪项结果？";
        }
      }else if(stage=="结果解释"){
        if(area==1){
          return "以下哪一条最符合你制定解决方案的描述？";
        }else if(area==2){
          return "在制定解决方案前，你最有可能提出以下哪个问题？";
        }else if(area==3){
          return "你制定解决方案的依据是什么？";
        }else if(area ==4){
          return "以下哪一项是你制定的解决方案？";
        }
      }
    },

    //改变选中的步骤
    change(index){
      this.active_step_index = index;
    },

    //改变当先显示步骤的第几个大选项 一共四个
    changeAreaIndex(value){
      if(this.optionindex==-1 && value==1){
        this.errMsg("请选择");
        return
      }
      if(this.areaIndex+value<=0){
        console.log("没有上一步");
        this.errMsg("没有上一步")
        return
      }
      let index = this.areaIndex;
      // this.areaIndex++;
      this.areaIndex = this.areaIndex + value;
      if(this.optionindex!=-1){ //确保是选了选项
        console.log("选了选项整理结果",this.currentStep,this.currentOptions[index-1])
        console.log("选中的小选项",JSON.parse(this.currentOptions[index-1].content)[this.optionindex])
        console.log(this.currentOptions[index-1].area)
        if(this.currentOptions[index-1].area==1){
          this.currentStep.a=JSON.parse(this.currentOptions[index-1].content)[this.optionindex].content;
          this.currentStep.a1=JSON.parse(this.currentOptions[index-1].content)[this.optionindex].grade;
        } else if(this.currentOptions[index-1].area==2){
          this.currentStep.b=JSON.parse(this.currentOptions[index-1].content)[this.optionindex].content;
          this.currentStep.b1=JSON.parse(this.currentOptions[index-1].content)[this.optionindex].grade;
        } else if(this.currentOptions[index-1].area==3){
          this.currentStep.c=JSON.parse(this.currentOptions[index-1].content)[this.optionindex].content;
          this.currentStep.c1=JSON.parse(this.currentOptions[index-1].content)[this.optionindex].grade;
        } else if(this.currentOptions[index-1].area==4){
          this.currentStep.d=JSON.parse(this.currentOptions[index-1].content)[this.optionindex].content;
          this.currentStep.d1=JSON.parse(this.currentOptions[index-1].content)[this.optionindex].grade;
        }
        this.optionindex = -1;
      }
      if(this.areaIndex==5){ //这里说明这个步骤已完成 这里需要做的事情：保存数据到result 显示步骤
        console.log("这个步骤结束了")
        console.log("组装后的一个结果",this.currentStep);
        this.areaIndex=1;
        this.showsteps = true;
        this.result.dataJson.push(this.currentStep);
        console.log("总结果",this.result.dataJson)
      }
    },

    //改变最小的选项的显示 高亮
    changeOptionIndex(index){
      this.optionindex = index;
    },

    //获取一个题目
    getquestion(){
        this.loading1 = true;
        this.$axios.get('question/selectById?questionId='+this.questionId)
        .then(res =>{
            // console.log(res)
            this.question = res.data.data[0];
            console.log("question",this.question);
            // this.question.stepList.sort(this.randomsort);
            for(let i=0; i<this.question.stepList.length; i++){
              this.result.dataJson.push(this.question.stepList[i])
            }
            this.currentStep = this.question.stepList[0];
            this.question.stepList = [];
            this.getoption();
        })
        .catch(err =>{
            console.log(err);
        })
    },

    //获取所有选项
    getoption(){
        // this.loading = true;
        this.$axios.get('option/select?questionId='+this.questionId)
        .then(res =>{
            // console.log(res)
            this.option = res.data.data;
            console.log("this.option",this.option)
            this.loading1 = false;
        })
        .catch(err =>{
            console.log(err)
        })
    },

    //检查是否完成了一个步骤的四个小问
    finishedabcd(datajsonitem,abcd){ //第一个参数为对象，第二个参数为对象的属性名 检查次属性名是有有值
    // console.log("--------------------------")
    // console.log(datajsonitem,abcd)
      return datajsonitem[abcd] ? true : false;
    },

    findquestionflag(datajsonitem,abcd){
      // console.log(datajsonitem,abcd)
      if(datajsonitem.context=="识别信息" && abcd =="a"){
        return "第1.1题"
      }else if(datajsonitem.context=="识别信息" && abcd =="b"){
        return "第1.2题"
      }else if(datajsonitem.context=="识别信息" && abcd =="c"){
        return "第1.3题"
      }else if(datajsonitem.context=="识别信息" && abcd =="d"){
        return "第1.4题"
      }else if(datajsonitem.context=="关系连接" && abcd =="a"){
        return "第2.1题"
      }else if(datajsonitem.context=="关系连接" && abcd =="b"){
        return "第2.2题"
      }else if(datajsonitem.context=="关系连接" && abcd =="c"){
        return "第2.3题"
      }else if(datajsonitem.context=="关系连接" && abcd =="d"){
        return "第2.4题"
      }else if(datajsonitem.context=="建立模型" && abcd =="a"){
        return "第3.1题"
      }else if(datajsonitem.context=="建立模型" && abcd =="b"){
        return "第3.2题"
      }else if(datajsonitem.context=="建立模型" && abcd =="c"){
        return "第3.3题"
      }else if(datajsonitem.context=="建立模型" && abcd =="d"){
        return "第3.4题"
      }else if(datajsonitem.context=="代入数据" && abcd =="a"){
        return "第4.1题"
      }else if(datajsonitem.context=="代入数据" && abcd =="b"){
        return "第4.2题"
      }else if(datajsonitem.context=="代入数据" && abcd =="c"){
        return "第4.3题"
      }else if(datajsonitem.context=="代入数据" && abcd =="d"){
        return "第4.4题"
      }else if(datajsonitem.context=="数学运算" && abcd =="a"){
        return "第5.1题"
      }else if(datajsonitem.context=="数学运算" && abcd =="b"){
        return "第5.2题"
      }else if(datajsonitem.context=="数学运算" && abcd =="c"){
        return "第5.3题"
      }else if(datajsonitem.context=="数学运算" && abcd =="d"){
        return "第5.4题"
      }else if(datajsonitem.context=="结果解释" && abcd =="a"){
        return "第6.1题"
      }else if(datajsonitem.context=="结果解释" && abcd =="b"){
        return "第6.2题"
      }else if(datajsonitem.context=="结果解释" && abcd =="c"){
        return "第6.3题"
      }else if(datajsonitem.context=="结果解释" && abcd =="d"){
        return "第6.4题"
      } 
    },
    //通过步骤获取这个步骤的选项
    findCurrentStepOption(stepcontext){
      if(!this.option){
        return
      }
      let currentOpotion = [];
      for(let i=0; i<this.option.length; i++){
        if(stepcontext==this.option[i].stage){
          this.option[i].content = JSON.stringify(JSON.parse(this.option[i].content).sort(this.randomsort));
          currentOpotion.push(this.option[i]);
        }
      }
      console.log("得到的这个步骤选项",currentOpotion)
      this.currentOptions = currentOpotion;
      return currentOpotion;
    },

    //
    //选取了步骤 获取选项显示出来
    showOption(){
      console.log("选取的步骤",this.question.stepList[this.active_step_index])
      this.currentStep = this.question.stepList[this.active_step_index];
      //获取步骤对应的四个选项
      this.findCurrentStepOption(this.question.stepList[this.active_step_index].context);
      this.showsteps = false; //显示选项
      this.question.stepList.splice(this.active_step_index,1); //删除步骤
      this.active_step_index = -1;
    },
    //获取当前显示完整的步骤名称
     selectTip(content){
            if(content==="识别信息"){
                return "识别信息：识别真实情境中包含的信息，确定关键信息。";
            }else if(content==="关系连接"){
                return "关系连接：建立关键信息之间的关系。";
            }
            else if(content==="建立模型"){
                return "建立模型：假设未知数，构建代数式子或者几何图形。";
            }
            else if(content==="代入数据"){
                return "代入数据：把真实情境中的已知数代入数学模型。";
            }
            else if(content==="数学运算"){
                return "数学运算：简化或者计算，得出数学结果。";
            }
            else if(content==="结果解释"){
                return "结果解释：结合真实情境，解释数学结果，得出解决问题的方案。";
            }
            return content
    },
    //提交结果
    //提交结果
    submitResult(){
       this.loading1 = true;
        if(this.result.length==6){
          this.errMsg("还有步骤未实现")
          this.loading1 = false;
          return
        }
        for(let i=0; i<this.result.dataJson.length; i++){
          if(!this.result.dataJson[i].a || !this.result.dataJson[i].b ||!this.result.dataJson[i].c ||!this.result.dataJson[i].d){
            this.errMsg("还有题目未完成");
            // console.log(this.result.answer1)
          
            this.loading1 = false;
            return
          }
          if(i==0&&this.result.dataJson[i].context=="识别信息")
            this.result.answer1++;
          else if(i==1&&this.result.dataJson[i].context=="关系连接")
            this.result.answer1++;
          else if(i==2&&this.result.dataJson[i].context=="建立模型")
            this.result.answer1++;
          else if(i==3&&this.result.dataJson[i].context=="代入数据")
            this.result.answer1++;
          else if(i==4&&this.result.dataJson[i].context=="数学运算")
            this.result.answer1++;
          else if(i==5&&this.result.dataJson[i].context=="结果解释")
            this.result.answer1++;
        }
        this.result.questionId = this.questionId;
        this.result.userId = this.userinfo.ticket;
        this.result.answer5 = 1; //表示这个版本
        // this.result.answer1 = this.result.answer1 / 1000;
        // this.result.answer2 = this.result.answer2 / 1000;
        // this.result.answer3 = this.result.answer3 / 1000;
        console.log("提交结果",this.result); //checkfinished
        let result = JSON.parse(JSON.stringify(this.result))
        result.dataJson = JSON.stringify(result.dataJson);
        console.log("提交结果",result); //checkfinished
        if(new Date().getTime() - this.enterpageTime < 30*60*1000){
          this.$confirm('答题时间没有30分钟，是否提交?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {

            parent.postMessage(result, "*"); //将书记处发送到平台
            this.loading1 = false;
            // this.$axios({
            //     method: 'post', 
            //     url: "result/insertResult0630",
            //     data: result})
            // .then(res =>{
            //     console.log(res);
            //     if(res.data.isok){
            //       this.Msg("提交成功");
            //       setTimeout(() => {
            //         this.$router.push("/studen0630")
            //       }, 500);
            //     }else{
            //       this.errMsg("提交失败")
            //     }
            //     this.loading1 = false;
            // })
            // .catch(err =>{
            //     console.log(err);
            //     this.errMsg("提交失败");
            //     this.loading1 = false;
            // })
          }).catch(() => {
            return        
          });
        }else{
            this.loading1 = true;
            parent.postMessage(result, "*"); //将书记处发送到平台
            this.loading1 = false;
            // this.$axios({
            //     method: 'post', 
            //     url: "result/insertResult0630",
            //     data: result})
            // .then(res =>{
            //     console.log(res);
            //     if(res.data.isok){
            //       this.Msg("提交成功");
            //       setTimeout(() => {
            //         this.$router.push("/studen0630")
            //       }, 500);
            //     }else{
            //       this.errMsg("提交失败")
            //     }
            //     this.loading1 = false;
            // })
        }
    },
    //时间到了自动提交结果
    autosubmitResult(){
        for(let i=0; i<this.result.dataJson.length; i++){
          if(i==0&&this.result.dataJson[i].context=="识别信息")
            this.result.answer1++;
          else if(i==1&&this.result.dataJson[i].context=="关系连接")
            this.result.answer1++;
          else if(i==2&&this.result.dataJson[i].context=="建立模型")
            this.result.answer1++;
          else if(i==3&&this.result.dataJson[i].context=="代入数据")
            this.result.answer1++;
          else if(i==4&&this.result.dataJson[i].context=="数学运算")
            this.result.answer1++;
          else if(i==5&&this.result.dataJson[i].context=="结果解释")
            this.result.answer1++;
        }
        this.result.questionId = this.questionId;
        this.result.userId = this.userinfo.ticket;
        console.log("提交结果",this.result); //checkfinished
        let result = JSON.parse(JSON.stringify(this.result))
        result.dataJson = JSON.stringify(result.dataJson);
        console.log("提交结果",result); //checkfinished
       
        this.loading1 = true;
        parent.postMessage(result, "*"); //将书记处发送到平台
        this.loading1 = false;
        // this.$axios({
        //     method: 'post', 
        //     url: "result/insertResult0630",
        //     data: result})
        // .then(res =>{
        //     console.log(res);
        //     if(res.data.isok){
        //       this.Msg("提交成功");
        //       setTimeout(() => {
        //         this.$router.push("/studen0630")
        //       }, 500);
        //     }else{
        //       this.errMsg("提交失败")
        //     }
        //     this.loading1 = false;
        // })
        
    },
    //获取右边的title
    getRightTitle(){
      if(this.questionId==24){
        return "请你选择去C加油站还是D加油站加油？"
      }else if(this.questionId==25){
        return "25"
      }else if(this.questionId==26){
        return "26"
      }
    },
    timeSecondsFormate(dateStr) {
        if (!this.notEmptyN(dateStr) || isNaN(Date.parse(dateStr))) return "";
        var dt = new Date(dateStr);
        return dt.getHours().toString().padStart(2, '0') + ':' + dt.getMinutes().toString().padStart(2, '0') +
            ':' + dt.getSeconds().toString().padStart(2, '0');
    }

  },
  watch:{
    areaIndex(val,oldval){
      // console.log(val)
      // for(let i=0; i<this.currentOpotion; i++)
      // JSON.parse(this.currentOptions[val].content)[this.optionindex].content
      
      // console.log(val,this.currentStep.a,JSON.parse(this.currentOptions[val-1].content))
      //点击上一步时找回之前选的选项
      for(let i=0; i<(JSON.parse(this.currentOptions[val-1].content)).length; i++){
        console.log((JSON.parse(this.currentOptions[val-1].content))[i])
        if(val==1 && this.currentStep.a==(JSON.parse(this.currentOptions[val-1].content))[i].content ){
          console.log("找到了")
          this.optionindex = i;
        }else if(val==2 && this.currentStep.b== (JSON.parse(this.currentOptions[val-1].content))[i].content){
          this.optionindex = i;
        }else if(val==3 && this.currentStep.c== (JSON.parse(this.currentOptions[val-1].content))[i].content){
          this.optionindex = i;
        }else if(val==4 && this.currentStep.d== (JSON.parse(this.currentOptions[val-1].content))[i].content){
          this.optionindex = i;
        }
      }
    }
  },
  mounted(){
    this.dragTwoColDiv("row", "right", "resizebar", "left");
    // this.questionId =  this.$route.params.qid + "";
    this.questionId =  "26";
      if(!(/^\d+$/).test(this.questionId) ){
        this.warnMsg("访问路径无效，已为您跳转！");
        // this.$router.push({path:'/studenthome'});
        return
    }
    this.getquestion();
    this.getoption();
    this.enterpageTime = new Date().getTime()

    //45分钟提醒
    setTimeout(()=>{
      this.$notify({
          duration:10000,
          title: '作答时间提醒',
          message:  '你已经作答45分钟了,请抓紧时间！70分钟将会自动提交。',
        });
    },1000*60*45)
    //75分钟自动提交
    setTimeout(()=>{
      this.$confirm('你已经作答75分钟，即将自动提交！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '确定',
        type: 'warning'
      })
      .then(()=>{
        this.autosubmitResult();
      })
      .catch(()=>{
        this.autosubmitResult();
      })
      
    },1000*60*75)
    //时间显示
    this.interval = setInterval(()=>{
      this.timeshow = this.timeSecondsFormate(new Date(new Date().getTime() - this.enterpageTime - 1000*60*60*8));
      // console.log(this.timeshow)
    },1000)
  },
  beforeDestroy() {
        //清除定时器
        clearInterval(this.interval)
        this.interval = null
        // console.log("beforeDestroy");
  },
  computed:{
        userinfo(){ //从vuex中获取信息
            // return this.$store.state.userinfo;
            return { //这个子页面不记录学生信息 为保证系统正常 这里随便赋值
              ticket:'000'
            }
        },
    },
}
</script>

<style scoped>
.qytip {
  text-align: left;
  width: 93%;
  margin: 0 auto;
  padding-left: 10px;
  border-radius: 10px;
  margin-bottom: 5vh;
  background-color: #F8CBAD;
  color: #000;
  font-size: 16px;
  /* font-weight: 700; */
}
.row {
  display: flex;
}
.left {
  /* background-color: #fff; */
  height: 100vh;
  overflow-y: scroll;
  align-items: center;
  justify-content: center;
  width: 60%;
  background-color: #F8CBAD;
  
}
.right {
  
  background-color: #FFE699;
  height: 100vh;
  overflow-y: scroll;
  align-items: center;
  justify-content: center;
  text-align: left;
  width: 40%;
  font-size: 20px;
  line-height:200%;
  /* padding:5vh 2%; */

}
 .tip {
  background-color: #fff;
  width: 20%;
  margin: 0 auto;
  padding: 2px 10px;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 20px;
  line-height:200%;
}
.right > .rightContainer {
  width: 95%;
  margin: 0 auto;
  border-radius: 40px;
  margin-bottom: 5vh;
  /* background-color: aquamarine; */

}
.right > .rightContainer .problem:nth-child(1){
  font-weight: 700;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
}
.right > .rightContainer .problem:nth-child(2){
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
}
#resizebar {
  overflow-y:hidden;
  width: 8px;
  cursor: w-resize;
  background-color: #fff;
}
.left_title {
  margin-top: 1vh;
}
.steps {
  width: 90%;
  padding: 30px 10px;
  background-color: #FFF;
  margin: 0 auto;
  border-radius: 40px;
  border: 1px solid #000;
  margin-top: 1vh;
  margin-bottom: 30vh;
  
}
.stepitem {
  padding: 5px 20px;
  text-align: left;
  font-weight: 600;
  border: 1px solid #eee;
  margin-top: 20px;
  font-size: 18px;
  transition:background-color 0.3s linear;
  display: flex;
}
.stepitem:hover{
  cursor: pointer;
  color: red;
}
/* 步骤被选中高亮色 */
.active_step { 
  background-color: #4472C4;
  color: #fff;
}

.problem {
  background-color: #fff;
  padding: 10px;
}
iframe {
  overflow: hidden;
}
.right_bottom {
  background-color: #FBE5D6;
}
.optionquestion {
  font-size: 18px;
  text-align: left;
  font-weight: 600;
}
.right_title {
  background-color: #B4C7E7;
  padding: 10px 10px;
  width: 90%;
  margin: 0 auto;
  border-radius: 40px;
  text-align: left;
  position: relative;
  bottom: 0px;
  font-size: 18px;
  color: #4472C4;
}

/* table的样式 */
.resulttable {
  /* margin-left: 10px;
  margin-top: 5px;
  margin-bottom: 20px; */
  background-color: #F8CBAD;
  width: 650px;
  margin: 0 auto;
  background: linear-gradient(90deg, rgba(255, 255, 255, 1) 5%, transparent 0), 
  /*0度直线，100灰度，0.1透明度，5%宽度，0透明度背景*/
                linear-gradient(rgba(255, 255, 255, 1) 5%, transparent 0),10px;
  /*横纵向宽距*/
  background-size: 90px 42px;
  background-position-x: 100px;
}
.resulttable table{
  border-left: 2px solid #fff;
  /* width: 100%; */
  background-color: #fff;
  
  
  /*90度直线，100灰度，0.1透明度，5%宽度，0透明度背景*/
  
  /* text-align: left; */
  /* border: ; */
}

.resulttable table td {
  /* border-right: 1px solid black; */
  /* width: 13%; */
  /* width: 100px !important; */
  min-width: 90px;
}
.resulttable table td tr:first-child{
  background-color: #4472C4;
  color: #fff;
  
}
.resulttable table td tr {
  /* border: 1px solid black; */
  min-width: 90px;
  height: 41px;
  line-height: 41px;
  background-color: #B4C7E7;
}
.checkblock {
  width: 30px;
  height: 30px;
  border: 2px solid #4472C4;
}
.whiteline {
  width: 100%;
  height: 4px;
  background-color: #fff;
  margin-top: 20px;
}
.leftBottom {
  background-color: #E2F0D9;
  padding-top: 20px;
  padding-bottom: 70px;
}
</style>>
  