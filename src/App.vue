<template>
  <div id="app">
    <!-- <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    <router-view/> -->
    <el-container>
      <el-header>Header</el-header>
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
                <!-- <el-menu-item index="warehousearea">库区信息</el-menu-item> -->
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

<style>
* {
  margin: 0;
  padding: 0;
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
