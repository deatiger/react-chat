import Button from '@material-ui/core/Button';

export default LoginButton = (props) => {
  return (
      <Button variant="contained" color="primary" onClick={() => props.login(props.username, props.password)}>
          Login
      </Button>
  );
}