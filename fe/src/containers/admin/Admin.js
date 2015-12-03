import React, { Component } from 'react';
import { connect } from 'react-redux';
import connectData from '../../helpers/connectData';
import Alert from '../../components/Alert';
import { pushState } from 'redux-router';
import formatForm from '../../utils/formatForm';
import { editOver } from '../../utils/actionOver';
import * as detailActions from '../../redux/modules/admin/detail';
import State from './State';

function fetchData(getState, dispatch, location) {
  return dispatch(detailActions.load({x: 'admin', id: location.query.id}));
}

@connectData(fetchData)
@connect(
  state => ({
    detail: state.adminDetail
  }),
  { ...detailActions, pushState }
)
export default class Admin extends Component {
  state = {
    validateMsg: null,
    showAlert: false
  }
  render() {
    let
      detail = this.props.detail;

    if (detail.loadData && detail.loadData.data) {
      let {xData} = detail.loadData.data;
      return (
        <div className="main admin">
          <table className="table1">
            <tbody>
            <tr>
              <td className="td1">&nbsp;</td>
              <td><h2>{xData._id ? '编辑' : '新增'}</h2></td>
            </tr>
            <tr>
              <td className="td1">账号：</td>
              <td><input type="text" ref="name" className="form-control" defaultValue={xData.name} /></td>
            </tr>
            <tr>
              <td className="td1">邮箱：</td>
              <td><input type="text" ref="email" className="form-control" defaultValue={xData.email} /></td>
            </tr>
            <tr>
              <td className="td1">密码：</td>
              <td><input type="password" ref="password" className="form-control" /></td>
            </tr>
            <tr>
              <td className="td1">&nbsp;</td>
              <td>
                <a href="javascript:void(0)" className="btn" onClick={this.handleSubmit.bind(this, xData._id)}>确定</a>&nbsp;&nbsp;
                <Alert data={detail.editData} loading={detail.editing} error={detail.editError} validateMsg={this.state.validateMsg} showAlert={this.state.showAlert} />
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      )
    } else {
      return <State data={detail.loadData} loading={detail.loading} error={detail.loadError} />
    }
  }
  handleSubmit(id) {
    let
      data = formatForm(this, [
        {
          name: 'name',
          rules: ['isRequired'],
          msgs: ['账号不能为空！']
        }, {
          name: 'email',
          rules: ['isRequired', 'isEmail'],
          msgs: ['邮箱不能为空！', '邮箱格式不正确！']
        }, {
          name: 'password',
          rules: ['isRequired'],
          msgs: ['密码不能为空！']
        }
      ]),
      props = this.props;

    // 提交
    if (data) {
      if (id) {
        editOver(props.update({x: 'admin', id}, data), this, ADMINPATH + 'adminList');
      } else {
        editOver(props.create({x: 'admin'}, data), this, ADMINPATH + 'adminList');
      }
    }
  }
}