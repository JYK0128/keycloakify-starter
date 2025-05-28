import { FormCheckbox, FormController, FormInput } from '#/customs';
import { KcContext, usePageContext } from '#/login/KcContext';
import { I18n } from '#/login/i18n';
import { Button, Separator } from '#/shadcn/components/ui';
import { kcSanitize } from 'keycloakify/lib/kcSanitize';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import { clsx } from 'keycloakify/tools/clsx';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Login(props: PageProps<Extract<KcContext, { pageId: 'login.ftl' }>, I18n>) {
  const { doUseDefaultCss, Template, classes } = props;
  const { i18n, kcContext } = usePageContext<Extract<KcContext, { pageId: 'login.ftl' }>>();

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  const { social, realm, url, usernameHidden, auth, registrationDisabled, messagesPerField } = kcContext;

  useEffect(() => {
    if (messagesPerField.existsError('username', 'password')) {
      form.setError('username', { type: 'custom' });
      form.setError('password', {
        type: 'custom',
        message: messagesPerField.getFirstError('username', 'password'),
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { msg, msgStr } = i18n;

  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={!messagesPerField.existsError('username', 'password')}
      headerNode={msg('loginAccountTitle')}
      displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
      infoNode={(
        <div>
          {msg('noAccount')}
          {' '}
          <Button className="text-link font-bold" variant="ghost" asChild>
            <a href={url.registrationUrl}>
              {msg('doRegister')}
            </a>
          </Button>
        </div>
      )}
      socialProvidersNode={
        realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
          <div className="size-full flex flex-col gap-0.5">
            <Separator orientation="horizontal" />
            <h2>{msg('identity-provider-login-label')}</h2>
            {social.providers.map((p) => (
              <Button key={p.alias} asChild>
                <a href={p.loginUrl} className="relative">
                  <i className={clsx('absolute left-5', 'fab', p.iconClasses)} aria-hidden="true" />
                  <span dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }} />
                </a>
              </Button>
            ))}
          </div>
        )
      }
    >
      {realm.password && (
        <FormController
          {...form}
          onSubmit={() => {
            setIsLoginButtonDisabled(true);
            return true;
          }}
          action={url.loginAction}
          method="post"
        >
          {/* Username */}
          {!usernameHidden && (
            <FormInput
              orientation="vertical"
              showError
              label={
                !realm.loginWithEmailAllowed
                  ? msg('username')
                  : !realm.registrationEmailAsUsername
                    ? msg('usernameOrEmail')
                    : msg('email')
              }
              control={form.control}
              name="username"
              type="text"
              autoFocus
              autoComplete="username"
            />
          )}
          {/* Password */}
          <FormInput
            orientation="vertical"
            showError
            label={msg('password')}
            control={form.control}
            name="password"
            type="password"
            autoComplete="current-password"
          />
          <div className="flex justify-between">
            {/* Remember Me */}
            {realm.rememberMe && !usernameHidden && (
              <FormCheckbox
                orientation="horizontal"
                control={form.control}
                name="rememberMe"
                label={msg('rememberMe')}
              />
            )}

            {/* Forget Password */}
            {realm.resetPasswordAllowed && (
              <Button className="text-link font-bold" variant="ghost" asChild>
                <a href={url.loginResetCredentialsUrl}>
                  {msg('doForgotPassword')}
                </a>
              </Button>
            )}
          </div>

          <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
          <Button
            className="w-full"
            disabled={isLoginButtonDisabled}
            name="login"
            id="kc-login"
            type="submit"
          >
            {msgStr('doLogIn')}
          </Button>
        </FormController>
      )}
    </Template>
  );
}
