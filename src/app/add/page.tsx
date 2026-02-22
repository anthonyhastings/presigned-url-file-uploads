import { type Metadata } from 'next';
import { AddApplication } from '@/views/add-application';
import { createApplication } from '../actions';

export const metadata: Metadata = {
  title: 'Add Application',
};

const AddApplicationPage = () => {
  return <AddApplication createApplication={createApplication} />;
};

export default AddApplicationPage;
