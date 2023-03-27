<template>
  <div id="app">
    <el-container>
      <el-header>
        <!-- <el-avatar class="logo" src="../assets/logo1.png"></el-avatar> -->
<img class="logo" src="../assets/logo1.png">
        <el-dropdown @command="handlerCommand" style="float: right; margin-top:20px ;">
          <span class="el-dropdown-link">
            下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="">欢迎您！{{ user.suName }}</el-dropdown-item>
            <el-dropdown-item command="">签发人:{{ user.iss }}</el-dropdown-item>
            <el-dropdown-item command="">拥有权限:{{ user.suRole }}</el-dropdown-item>
            <el-dropdown-item divided command="exit">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>


      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu router default-active="2" class="el-menu-vertical-demo">

            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-s-home"></i>
                <span>仓库管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="warehouse">仓库信息</el-menu-item>
                <el-menu-item index="warehousearea">库区信息</el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-coin"></i>
                <span>物料管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="material">物料信息</el-menu-item>
                <el-menu-item index="output">出库数据</el-menu-item>
                <el-menu-item index="input">入库数据</el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-s-order"></i>
                <span>图形数据</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="waofwh"><i class="el-icon-s-data"></i>仓库库区数量</el-menu-item>
                <el-menu-item index="capacity"><i class="el-icon-s-help"></i>仓库容量</el-menu-item>
              </el-menu-item-group>
            </el-submenu>

          </el-menu>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import jwt_decode from 'jwt-decode'
export default {
  created() {
    // 页面初始化时获取保存在localStorage中的token
    var token = window.localStorage.getItem("token")
    // 进行解析
    if (token != null) {
      this.user = jwt_decode(token)
    } else {
      this.$router.replace("/")
    }
  },
  data() {
    return {
      user: {
        suId: '',
        suName: '',
        suRole: '',
      }
    }
  },
  methods: {
    handlerCommand(command) {
      switch (command) {
        case "exit":
          window.localStorage.removeItem("token")
          this.$message({
            type: 'success',
            message: "已安全退出"
          })
          this.$router.replace("/")
          break;
        case "info":
          break;
      }
    }
  }
}
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
.logo{
float: left;
/* margin-top: calc((100% - 50px) / 2); */
margin-top: -15px;
margin-left: 30px;
/* border-radius: 100%; */
width: 100px;
height: 100px;
}
.el-header,
.el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  /* line-height: 60px; */
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  /* line-height: 200px; */
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  height: calc(100vh - 60px)
    /* line-height: 160px; */
}

body>.el-container {
  margin-bottom: 40px;
}
</style>
  