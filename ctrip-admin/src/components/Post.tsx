export type Post = {
  postid: number;
  image: string;
  title: string;
  content: string;
  status: number;
  rejection_message?: string; // rejected posts must have rejection message
  deleted: boolean; // whether or not deleted by administrator
};
