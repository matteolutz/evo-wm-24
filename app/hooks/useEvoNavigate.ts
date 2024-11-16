import { useNavigate, useSearchParams } from '@remix-run/react';

const useEvoNavigate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return (to: string) =>
    navigate({ pathname: to, search: searchParams.toString() });
};

export default useEvoNavigate;
