<template>
  <div class="loginFrom">
    <el-form :model="ruleForm" :rules="rules" ref="rulForm">
      <el-form-item class="font el-form-item" label="账户：" prop="name"
        :rules="[{ required: true, message: '请输入账户名称', trigger: 'blur' }]">
        <el-input type="text" v-model="ruleForm.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item class="font el-form-item" label="密码：" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item class="font el-form-item" label="确认密码：" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <!-- <el-form-item class="font el-form-item" label="年龄：" prop="age">
        <el-input v-model.number="ruleForm.age"></el-input>
      </el-form-item> --> <!-- v-model.number 将前端输入的字符串转换成数值 -->
      <el-form-item class="font el-form-item" label="电子邮箱：" prop="email" :rules="[{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email' /* 文本输入框类型为email具有验证作用 */, message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
        <el-input type="text" v-model="ruleForm.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item class="font el-form-item" label="手机号：" prop="phone">
        <el-input maxlength="11" type="text" v-model.number="ruleForm.phone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item class="font el-form-item" label="手机验证码：" prop="checkCode">
        <el-input maxlength="6" type="text" v-model.number="ruleForm.checkCode" autocomplete="off"
          style="width: calc(100% - 90px);vertical-align: bottom"></el-input>
        <el-button class="btn-orange" :disabled="disabled" @click="getCode()"
          style="width: 90px;padding:12px 0px;;">{{ checkButton }}</el-button>
      </el-form-item>
      <el-form-item align="right">
        <el-button type="primary" @click="submitForm('rulForm')">注册</el-button>
        <el-button @click="resetForm()" style="margin-right:5px;">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  mounted() {
    document.querySelector('body').setAttribute('style', 'background-image: url(' + require('../assets/e745bdde880411ebb6edd017c2d2eca2.jpg') + ');background-size: cover;');
    document.querySelector('.loginFrom').setAttribute('style', 'width: 350px;height: 560px;background-color: rgb(0, 0, 0, 0.05);position: absolute;left:50%;top: 50%;transform: translate(calc(-20%),calc(-45%));border-radius: 10px;backdrop-filter: blur(3px);box-shadow: 0 0 5px rgb(255, 255, 255, 0.5);');
    /* document.querySelectorAll('.font label').setAttribute('style','color: red;');
    document.querySelectorAll('.el-form-item').setAttribute('style','margin-bottom: 5px;'); */
    for (const iterator of document.querySelectorAll('.font label')) {
      iterator.setAttribute('style', 'color: rgb(255, 255, 255, 0.7);');
    }
    for (const iterator of document.querySelectorAll('.el-form-item')) {
      iterator.setAttribute('style', 'margin-bottom: 5px;');
    }
    // console.log(document.querySelectorAll('.font label'))
  },
  beforeDestroy() {
    document.querySelector('body').removeAttribute('style')
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      var a = /^1[3457896]\d{9}$/
      if (value == '') {
        callback(new Error('请输入手机号'));
      } else if ((value + '').length != 11) {
        callback(new Error('请输入正确的11位手机号'));
      } else if (a.test(value)) {
        callback();
      } else {
        callback(new Error('格式错误'));
      }
    };


    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.rulForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    // var checkCode=(rule, value, callback)=>{
    //   this.$refs.rulForm.validateField('checkCode');
    // };
    return {
      ruleForm: {
        name: '',
        pass: '',
        checkPass: '',
        email: '',
        phone: '',
        // age: ''
      },
      checkCode: '',
      checkButton: '获取验证码',
      disabled: false,
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur', required: true }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur', required: true }
        ],

        phone: [{ validator: checkPhone, trigger: 'blur', required: true }],

        checkCode: [{ message: '请输入验证码', trigger: 'blur', required: true }]
      }
    };
  },
  methods: {
    getCode() {
      this.$refs.rulForm.validateField('phone', phone => {
        if (!phone) {
          let time = 60;
                  let timer = setInterval(() => {
                      if(time == 0){
                          clearInterval(timer);
                          this.checkButton = '获取验证码';
                          this.disabled = false;
                      }else{
                          this.disabled = true;
                          this.checkButton = time + '秒后重试';
                          time--;
                      }
                  }, 1000);
        }
      });


    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$router.replace("/login")
    }
  }
}
</script>
