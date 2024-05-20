import { LoginProps } from '@/utils/types';
import { useMagic } from '../MagicProvider';
import { useEffect, useState } from 'react';
import { saveUserInfo } from '@/utils/common';
import Spinner from '../../ui/Spinner';
import Image from 'next/image';
import google from 'public/social/Google.svg';
import Card from '../../ui/Card';
import CardHeader from '../../ui/CardHeader';
import { signIn, useSession, getSession } from "next-auth/react";

const Google = ({ token, setToken }: LoginProps) => {
  const { magic } = useMagic();
  const { data: session, status } = useSession();
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadingFlag = localStorage.getItem('isAuthLoading');
    setIsAuthLoading(loadingFlag === 'true');
  }, []);

  useEffect(() => {
    if (status === 'authenticated' || session) {
      loginWithMagic();
    }
  }, [status]);

  const loginWithMagic = async () => {
    const session = await getSession();
    const DID = await magic?.openid.loginWithOIDC({
      jwt: session?.idToken,
      providerId: "Yi56jvlw9lzf9vSNMUnGjVvMxIpeCBaor85u2EGvncU="
    });

    const metadata = await magic?.user.getMetadata();
    setToken(DID ?? '');
    saveUserInfo(DID ?? '', 'SOCIAL', metadata?.publicAddress ?? '');
    setLoadingFlag(false);
  };

  const login = async () => {
    setLoadingFlag(true);
    await signIn('google', { redirect: false });
  };

  const setLoadingFlag = (loading: boolean) => {
    localStorage.setItem('isAuthLoading', loading.toString());
    setIsAuthLoading(loading);
  };

  return (
    <Card>
      <CardHeader id="google">Google Login</CardHeader>
      {isAuthLoading ? (
        <Spinner />
      ) : (
        <div className="login-method-grid-item-container">
          <button
            className="social-login-button"
            onClick={() => {
              if (token.length === 0) login();
            }}
            disabled={false}
          >
            <Image src={google} alt="Google" height={24} width={24} className="mr-6" />
            <div className="w-full text-xs font-semibold text-center">Continue with Google</div>
          </button>
        </div>
      )}
    </Card>
  );
};

export default Google;
