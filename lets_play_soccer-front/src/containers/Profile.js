import React, {Component} from 'react'
import photo from '../assets/content_images/Mask.png';
import Toolbar from '../components/UI/Toolbar';
import {logoutUser, clearUserErrors, updateUser} from '../store/actions/userAction';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux';
import config from '../config';
import {Upload, Icon, message, Input} from 'antd';


class Profile extends Component {
    state = {
        phone: this.props.user.phoneNumber,
        name: this.props.user.displayName,
        image: "",
        avatar: this.props.user.avatar,
        email: this.props.user.email,
        loading: false,
        edit: false
    };


    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            console.log(info.file)
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    image: imageUrl,
                    loading: false,
                    avatar: info.file.originFileObj
                }),
            );
        }
    };


    updateInput = e => {
        e.preventDefault();
        this.setState({[e.target.name]: e.target.value})
    };

    activeEditing = () => {
        this.setState({edit: true});
    };


    saveData = () => {
        this.setState({edit: false});
        const formData = new FormData();
        formData.append('displayName', this.state.name);
        formData.append('avatar', this.state.avatar);
        formData.append('email', this.state.email);
        this.props.updateDataUser(formData);
    };

    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <>
                <header className="profile-header d-flex justify-content-between">
                    <span className="profile-header-btn-menu">
                        <Toolbar {...this.props}/>
                    </span>
                    <div className="profile-header-title">Профиль</div>
                    <button className="profile-header-btn-edit" onClick={this.activeEditing}>Изменить</button>
                </header>
                <div className="profile-container">
                    <div className="profile-main">
                        <div className="profile-main-userInfo">
                            <div className="profile-main-avatar">
                                {
                                    this.state.edit ?
                                        <Upload
                                            name="avatar"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                            beforeUpload={this.beforeUpload}
                                            onChange={this.handleChange}
                                        >
                                            {this.state.image ?
                                                <img src={this.state.image} alt="avatar"
                                                     style={{width: '100%'}}/> : uploadButton}
                                        </Upload> :
                                        <span className="avatar-uploader ant-upload-picture-card-wrapper">
                                            <div
                                                className="ant-upload ant-upload-select ant-upload-select-picture-card border-none">
                                                {
                                                    this.state.avatar ?
                                                        <img className="ant-upload" src={config.publicUserFolder + this.props.user.avatar} alt='user'/> :
                                                        <img className="ant-upload" src={photo} alt='user'/>
                                                }
                                            </div>
                                        </span>
                                }
                            </div>
                            {
                                this.state.edit ?
                                    <Input onChange={this.updateInput} className="input" name="name" type="text"/> :
                                    <span className="profile-main-nameUser">{this.state.name}</span>
                            }
                        </div>
                        <div className="profile-main-contacktDetails">
                            <div className="profile-main-contacktDetails-title">Контактные данные</div>
                            <div className="profile-main-contacktDetails-phoneTitle">Номер телефона</div>
                            <div>{this.state.phone}</div>
                            <div className="profile-main-contacktDetails-mailTitle">Адрес почты</div>
                            {
                                this.state.edit ?
                                    <Input onChange={this.updateInput} className="input" name="email" type="email"/> :
                                    <div>{this.state.email}</div>
                            }
                        </div>
                        <div>
                            {
                                this.state.edit ?
                                    <button onClick={this.saveData}
                                            className="btn btn-primary margin-top">Save</button> : null
                            }
                        </div>
                    </div>
                </div>
            </>
        );
    }
};
const mapStateToProps = state => {
    return {
        user: state.users.user
    }
};

const mapDispatchToProps = dispatch => ({
    onLogoutUser: () => dispatch(logoutUser()),
    clearUserErrors: () => dispatch(clearUserErrors()),
    updateDataUser: (updateDataUser) => dispatch(updateUser(updateDataUser)),
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));