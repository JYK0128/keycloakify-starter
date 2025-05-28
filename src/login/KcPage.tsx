import type { ClassKey } from 'keycloakify/login';
import DefaultPage from 'keycloakify/login/DefaultPage';
import { Suspense, lazy } from 'react';
import { KcContext } from './KcContext';
import Template from './Template';
import { useI18n } from './i18n';


const doMakeUserConfirmPassword = true;

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const LoginResetPassword = lazy(() => import('./pages/LoginResetPassword'));
const LoginUpdatePassword = lazy(() => import('./pages/LoginUpdatePassword'));
const LoginUpdateProfile = lazy(() => import('./pages/LoginUpdateProfile'));
const LoginVerifyEmail = lazy(() => import('./pages/LoginVerifyEmail'));
const LoginPageExpired = lazy(() => import('./pages/LoginPageExpired'));
const LoginConfigTotp = lazy(() => import('./pages/LoginConfigTotp'));
const LoginOauthGrant = lazy(() => import('./pages/LoginOauthGrant'));

const IdpReviewUserProfile = lazy(() => import('./pages/IdpReviewUserProfile'));
const LoginIdpLinkConfirm = lazy(() => import('./pages/LoginIdpLinkConfirm'));
const LoginIdpLinkConfirmOverride = lazy(() => import('./pages/LoginIdpLinkConfirmOverride'));
const LoginIdpLinkEmail = lazy(() => import('./pages/LoginIdpLinkEmail'));
const LoginOauth2DeviceVerifyUserCode = lazy(() => import('./pages/LoginOauth2DeviceVerifyUserCode'));
const LoginOtp = lazy(() => import('./pages/LoginOtp'));

const Terms = lazy(() => import('./pages/Terms'));
const Info = lazy(() => import('./pages/Info'));
const ErrorPage = lazy(() => import('./pages/Error'));
const UserProfileFormFields = lazy(() => import('./UserProfileFormFields'));

export default function KcPage(props: { kcContext: KcContext }) {
  const { kcContext } = props;

  const { i18n } = useI18n({ kcContext });

  return (
    <KcContext.Provider value={kcContext}>
      <Suspense>
        {(() => {
          switch (kcContext.pageId) {
            case 'login.ftl': return (
              <Login
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
            case 'login-reset-password.ftl': return (
              <LoginResetPassword
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
            case 'login-update-password.ftl': return (
              <LoginUpdatePassword
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
            case 'login-verify-email.ftl': return (
              <LoginVerifyEmail
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
            case 'login-update-profile.ftl': return (
              <LoginUpdateProfile
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
                UserProfileFormFields={UserProfileFormFields}
                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
              />
            );
            case 'login-config-totp.ftl': return (
              <LoginConfigTotp
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
            case 'login-oauth-grant.ftl': return (
              <LoginOauthGrant
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
            case 'idp-review-user-profile.ftl': return (
              <IdpReviewUserProfile
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
                UserProfileFormFields={UserProfileFormFields}
                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
              />
            );
            case 'login-idp-link-confirm.ftl': return (
              <LoginIdpLinkConfirm
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
            case 'login-idp-link-confirm-override.ftl': return (
              <LoginIdpLinkConfirmOverride
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
            case 'login-idp-link-email.ftl': return (
              <LoginIdpLinkEmail
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
            case 'login-oauth2-device-verify-user-code.ftl': return (
              <LoginOauth2DeviceVerifyUserCode
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
            case 'login-otp.ftl': return (
              <LoginOtp
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
            case 'login-page-expired.ftl': return (
              <LoginPageExpired
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
            case 'register.ftl': return (
              <Register
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
                UserProfileFormFields={UserProfileFormFields}
                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
              />
            );
            case 'terms.ftl': return (
              <Terms
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
            case 'info.ftl': return (
              <Info
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
            case 'error.ftl': return (
              <ErrorPage
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
            default: return (
              <DefaultPage
                kcContext={kcContext}
                i18n={i18n}
                classes={classes}
                Template={Template}
                doUseDefaultCss={false}
                UserProfileFormFields={UserProfileFormFields}
                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
              />
            );
          }
        })()}
      </Suspense>
    </KcContext.Provider>
  );
}

const classes = {} satisfies { [key in ClassKey]?: string };
