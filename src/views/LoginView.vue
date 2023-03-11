<template>
    <div class="loginFrom">
        <div>
            <el-form>

                <el-form-item class="font" label="账户：">
                    <el-input type="text" v-model="sysUser.suName" placeholder="请输入账户名称">
                    </el-input>
                </el-form-item>
                <el-form-item class="font" label="密码：">
                    <el-input type="password" v-model="sysUser.suPassword" placeholder="请输入账户密码">
                    </el-input>
                </el-form-item>

                <el-form-item align="right" style="margin-right: 5px;">
                    <el-button @click="register()">注册</el-button>
                    <el-button type="primary" @click="login()">登录</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import qs from 'qs'
export default {
    // created(){
    //     window.document.body.style.backgroundImage='url("../assets/e745bdde880411ebb6edd017c2d2eca2.jpg")'
    // },
    data() {
        return {
            formLabelWidth: '40px',
            sysUser: {
                suName: '',
                suPassword: '',
            }
        }
    },
    methods: {
        login() {
            axios.post("http://localhost:9090/sys_user", qs.stringify(this.sysUser)).then(res => {
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: res.data.msg

                    })
                    window.localStorage.setItem("token", res.data.obj)
                    this.$router.replace("/index")
                } else[
                    this.$message({
                        type: 'error',
                        message: res.data.msg
                    })
                ]
            })

        },
        register(){
            // window.document.body.style.backgroundImage='url("../assets/e745bdde880411ebb6edd017c2d2eca2.jpg")'
            
            this.$router.replace("/register")
        }
    }
}
</script>
<style>
* {
    margin: 0;
    padding: 0;
}

body {
    background-image: url(../assets/c53c811f880411ebb6edd017c2d2eca2.jpg);
    background-size: cover;
}

.loginFrom {
    width: 350px;
    height: 250px;
    background-color: rgb(0, 0, 0, 0.05);
    position: absolute;
    right:10%;
    top: 50%;
    border-radius: 10px;
    backdrop-filter: blur(3px);
    box-shadow: 0 0 5px rgb(255, 255, 255, 0.5);
}


.font label{
    color: rgb(255, 255, 255, 0.7);
}
</style>