import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Card, CardContent, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { backend } from 'declarations/backend';

const HeroSection = styled('div')(({ theme }) => ({
  backgroundImage: 'url(https://images.unsplash.com/photo-1634386708556-f1a553527aa0?ixid=M3w2MzIxNTd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjUwNDQyMjJ8&ixlib=rb-4.0.3)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(8),
  textAlign: 'center',
  marginBottom: theme.spacing(4),
}));

const FloatingButton = styled(Button)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
}));

type Post = {
  id: number;
  title: string;
  body: string;
  author: string;
  createdAt: number;
};

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
    setIsLoading(false);
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await backend.createPost(data.title, data.body, data.author);
      setModalIsOpen(false);
      reset();
      await fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
    setIsLoading(false);
  };

  return (
    <Container>
      <HeroSection>
        <Typography variant="h2" component="h1" gutterBottom>
          Crypto Blog
        </Typography>
        <Typography variant="h5">
          Stay updated with the latest in cryptocurrency
        </Typography>
      </HeroSection>

      {isLoading ? (
        <CircularProgress />
      ) : (
        posts.map((post) => (
          <Card key={post.id} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h5" component="h2">
                {post.title}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                By {post.author} on {new Date(Number(post.createdAt) / 1000000).toLocaleString()}
              </Typography>
              <Typography variant="body1">{post.body}</Typography>
            </CardContent>
          </Card>
        ))
      )}

      <FloatingButton
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setModalIsOpen(true)}
      >
        New Post
      </FloatingButton>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="New Post Modal"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '500px',
            width: '100%',
          },
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Create New Post
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="title">Title</label>
            <input {...register('title', { required: true })} id="title" />
          </div>
          <div>
            <label htmlFor="body">Body</label>
            <textarea {...register('body', { required: true })} id="body" />
          </div>
          <div>
            <label htmlFor="author">Author</label>
            <input {...register('author', { required: true })} id="author" />
          </div>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
      </Modal>
    </Container>
  );
};

export default App;
