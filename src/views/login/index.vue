<template>
    <div class="login-container">
        <vue-particles
            color="#dedede"
            :particleOpacity="0.7"
            :particlesNumber="30"
            shapeType="circle"
            :particleSize="6"
            linesColor="#FFFFFF"
            :linesWidth="2"
            :lineLinked="true"
            :lineOpacity="0.4"
            :linesDistance="200"
            :moveSpeed="5"
            :hoverEffect="true"
            hoverMode="grab"
            :clickEffect="true"
            clickMode="push"
            class="cash"
        ></vue-particles>
        <el-form
            class="card-box login-form"
            autocomplete="on"
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-position="left"
        >
            <h3 class="title">泾川县建设工程监管平台</h3>
            <el-form-item prop="username" class="item">
                <el-input
                    placeholder="账户"
                    name="userName"
                    autocomplete="on"
                    v-model="ruleForm.userName"
                >
                    <i slot="prefix" class="el-input__icon el-icon-user"></i>
                </el-input>
            </el-form-item>
            <el-form-item prop="password" class="item">
                <el-input
                    placeholder="密码"
                    name="pwd"
                    :type="isShowPwd ? 'text' : 'password'"
                    @keyup.enter.native="handleLogin"
                    v-model="ruleForm.pwd"
                >
                    <i slot="prefix" class="el-input__icon el-icon-key"></i>
                </el-input>
            </el-form-item>
            <div>
                <el-button
                    type="primary"
                    style="width:100%;margin-bottom:30px;"
                    :loading="loading"
                    @click.native="handleLogin()"
                >登录</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        let validatePwd = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入密码"));
            } else {
                callback();
            }
        };
        return {
            ruleForm: {
                userName: "",
                pwd: "",
                checked: true
            },
            rules: {
                userName: [
                    { required: true, message: "请输入账户名", trigger: "blur" }
                ],
                pwd: [{ validator: validatePwd, trigger: "blur" }]
            },
            isShowPwd: false, // 是否显示密码
            loading: false, // 登录loading
            showDialog: false, // 显示dialog
            redirect: null // 回调地址
        };
    },
    methods: {
        handleLogin() {
            this.$refs["ruleForm"].validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.$store
                        .dispatch("loginName", this.ruleForm)
                        .then(response => {
                            this.loading = false;
                            if (response.code) {
                                this.$message.error(response.message);
                                return;
                            }
                            let path = "/";
                            if (this.redirect) {
                                path = this.redirect;
                            }
                            this.$router.push({
                                path: path
                            });
                        })
                        .catch(() => {
                            this.loading = false;
                        });
                } else {
                    return false;
                }
            });
        }
    },
    created() {
        // 将参数拷贝进查询对象
        let query = this.$route.query;
        if (query.redirect) {
            // URL Encode
            this.redirect = decodeURIComponent(query.redirect);
        }
    }
};
</script>

<style type="text/scss" lang="scss">
@import "../../styles/mixin";
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  @include relative;
  height: 100%;
  background-color: $bg;
  .cash {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
  }
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #293444 inset !important;
    -webkit-text-fill-color: #fff !important;
  }
  .item {
    .el-form-item__content {
      display: flex;
      flex-flow: row;
    }
  }
  input {
    background: transparent;
    border: 0;
    -webkit-appearance: none;
    border-radius: 0;
    padding: 2px 15px 2px 30px;
    color: $light_gray;
    height: 100%;
    &:focus {
      padding: 2px 15px 2px 30px;
    }
  }
  .el-input {
    display: inline-block;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 0.13333rem;
  }
  .svg-container {
    padding: 0.08rem 0.0666rem 0.08rem 0.2rem;
    color: $dark_gray;
    vertical-align: middle;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    color: $light_gray;
    margin: 0 auto 1rem auto;
    text-align: center;
    font-weight: bold;
  }
  .login-form {
    @include fxied-center;
    top: 40%;
    width: 22em;
    padding: 0.4666rem 0.4666rem 0.2rem 0.4666rem;
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 0.0666rem;
    color: #454545;
  }
  .show-pwd {
    position: absolute;
    right: 0.1333rem;
    top: 0.09333rem;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
  }
}
</style>
