import { AddApplication } from '@/views/add-application';
import { createApplication } from '../actions';

const AddApplicationPage = () => {
  return <AddApplication createApplication={createApplication} />;
};

export default AddApplicationPage;
