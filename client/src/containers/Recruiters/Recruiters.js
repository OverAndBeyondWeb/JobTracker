import React, { Component } from 'react';
import axios from 'axios';

import Modal from '../../components/Modal/Modal';
import Recruiter from '../../components/Recruiter/Recruiter';
import RecruiterForm from '../../components/Forms/RecruiterForm/RecruiterForm';

class Recruiters extends Component {

  state = {
    showModal: false,
    formData: {
      fname: '',
      lname: '',
      title: '',
      internal: '',
      email: '',
      phone: '',
      'company_name': ''
    },
    prepopulationData: {
      fname: '',
      lname: '',
      title: '',
      internal: '',
      email: '',
      phone: '',
      'company_name': ''
    },
    recruiterData: [],
    addRecruiterForm: false,
    editRecruiterForm: false
  }

  componentDidMount() {
    this.getRecruitersFromApi();
  }

  getRecruitersFromApi = () => {
    axios.get('/api/recruiters')
      .then(results => {
        this.setState({recruiterData: results.data})
      })
      .catch(err => console.log(err));
  }

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal
    });
  }

  handleChange = (e) => {
    let formData = {...this.state.formData}
    formData[e.target.name] = e.target.value
    this.setState({formData});
  }

  openRecruiterForm = (form, id) => {

    // Set addrecruiterForm or editJobForm to true 
    this.setState({[form]:!this.state[form]});
    
    let recruiter = this.state.recruiterData.find(recruiter => recruiter.id === id);

    for (let prop in recruiter) {
      if(recruiter[prop] === null) {
        recruiter[prop] = '';
      } 
    };

    this.setState({
      prepopulationData: recruiter ? recruiter : this.state.prepopulationData,
      formData: recruiter
    });

    this.toggleModal();
  }

  addRecruiter = () => {
    const { formData } = this.state;
    axios.post('/api/recruiters', formData)
      .then(results => {
        console.log(results);
        let formData = {...this.state.formData}
        formData.title = '';
        formData.fname = '';
        formData.lname = '';
        formData.internal = '';
        formData.email = '';
        formData.phone = '';
        formData['company_name'] = '';

        this.setState({formData});
        this.getRecruitersFromApi();
      })
      .catch(err => console.log(err));
    console.log('confirm added');
  }

  editRecruiter = () => {

  }

  submitForm = (e) => {
    e.preventDefault();
    console.log('submitted');
    if(this.state.addRecruiterForm) {
      this.addRecruiter();
      console.log('added');
    } else if(this.state.editRecruiterForm) {
      this.editRecruiter();
      console.log('edited');
    } else {
      return;
    }
    
    this.toggleModal();
    this.setState({
      addRecruiterForm: false,
      editRecruiterForm: false
    });
  }

  deleteRecruiter = (id) => {
    axios.delete('/api/recruiters', {data: {id}})
      .then(results => {
        let recruiterData = this.state.recruiterData.filter(recruiter => recruiter.id !== id);

        this.setState({recruiterData});
      })
  }

  render() {
    return (
      <div>
        {this.state.showModal && <Modal render={() => (<RecruiterForm submitForm={this.submitForm} handleChange={this.handleChange} prepopulationData={this.state.prepopulationData}/>)}/>}
        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4 container">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Recruiters</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <div className="btn-group mr-2">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => this.openRecruiterForm('addRecruiterForm')}
                >Add Recruiter</button>
                <button className="btn btn-sm btn-outline-secondary">Export</button>
              </div>
              <button className="btn btn-sm btn-outline-secondary dropdown-toggle">
                <span data-feather="calendar"></span>
                This week
              </button>
            </div>
          </div>

          <canvas className="my-4 w-100" id="myChart" width="0" height="0"></canvas>

          <h2>Section title</h2>
          <div className="table-responsive">
            <table className="table table-striped table-sm">
              <thead>
                <tr>
                  <th>Internal/External</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>title</th>
                  <th>Company</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.state.recruiterData.map(recruiter => (
                  <Recruiter recruiter={recruiter} delete={() => this.deleteRecruiter(recruiter.id) } edit={() => this.openRecruiterForm('editRecruiterForm', recruiter.id)} key={recruiter.id}/>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    )
  }
};

export default Recruiters;