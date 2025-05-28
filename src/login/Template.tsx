import { Alert, AlertDescription, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/shadcn/components/ui';
import { kcSanitize } from 'keycloakify/lib/kcSanitize';
import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
import { useInitialize } from 'keycloakify/login/Template.useInitialize';
import type { TemplateProps } from 'keycloakify/login/TemplateProps';
import { clsx } from 'keycloakify/tools/clsx';
import { useSetClassName } from 'keycloakify/tools/useSetClassName';
import { CircleCheckBig, CircleX, Info, TriangleAlert } from 'lucide-react';
import { useEffect } from 'react';
import type { I18n } from './i18n';
import type { KcContext } from './KcContext';

export default function Template(props: TemplateProps<KcContext, I18n>) {
  const {
    displayInfo = false,
    displayMessage = true,
    headerNode,
    socialProvidersNode = null,
    infoNode = null,
    documentTitle,
    bodyClassName,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
    children,
  } = props;

  const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
  const { msg, msgStr, currentLanguage, enabledLanguages } = i18n;
  const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

  useEffect(() => {
    document.title = documentTitle ?? msgStr('loginTitle', realm.displayName);
  }, []);

  useSetClassName({
    qualifiedName: 'html',
    className: kcClsx('kcHtmlClass'),
  });

  useSetClassName({
    qualifiedName: 'body',
    className: bodyClassName ?? clsx('kcBodyClass', ''),
  });

  const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

  if (!isReadyToRender) {
    return null;
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <h1 className="flex items-center gap-2 self-center font-extrabold text-3xl">
          {msg('loginTitleHtml', realm.displayNameHtml)}
        </h1>
        <Card>
          <CardHeader>
            <div className="justify-self-end">
              {enabledLanguages.length > 1 && (
                <Select
                  defaultValue={currentLanguage.languageTag}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {enabledLanguages.map(({ languageTag, label, href }) => (
                      <SelectItem key={languageTag} value={languageTag} role="none">
                        <a role="menuitem" href={href}>
                          {label}
                        </a>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <CardTitle className="flex justify-between items-end">
              {!(auth !== undefined && auth.showUsername && !auth.showResetCredentials)
                ? (
                  <h2>{headerNode}</h2>
                )
                : (
                  <div id="kc-username" className={kcClsx('kcFormGroupClass')}>
                    <label id="kc-attempted-username">{auth.attemptedUsername}</label>
                    <a id="reset-login" href={url.loginRestartFlowUrl} aria-label={msgStr('restartLoginTooltip')}>
                      <div className="kc-login-tooltip">
                        <i className={kcClsx('kcResetFlowIcon')} />
                        <span className="kc-tooltip-text">{msg('restartLoginTooltip')}</span>
                      </div>
                    </a>
                  </div>
                )}
            </CardTitle>
            <CardDescription />
          </CardHeader>
          <CardContent>
            {displayMessage && message !== undefined && (message.type !== 'warning' || !isAppInitiatedAction) && (
              <Alert
                variant={({
                  error: 'destructive',
                  warning: 'warning',
                  success: 'success',
                  info: 'info',
                } as const)[message.type]}
              >
                {({
                  error: <CircleX />,
                  warning: <TriangleAlert />,
                  success: <CircleCheckBig />,
                  info: <Info />,
                } as const)[message.type]}

                <AlertDescription
                  dangerouslySetInnerHTML={{
                    __html: kcSanitize(message.summary),
                  }}
                />
              </Alert>
            )}

            {children}

            {auth !== undefined && auth.showTryAnotherWayLink && (
              <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                <div className={kcClsx('kcFormGroupClass')}>
                  <input type="hidden" name="tryAnotherWay" value="on" />
                  <a
                    href="#"
                    id="try-another-way"
                    onClick={() => {
                      document.forms['kc-select-try-another-way-form' as never].submit();
                      return false;
                    }}
                  >
                    {msg('doTryAnotherWay')}
                  </a>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-center">
            {socialProvidersNode}
            {displayInfo && (
              <div>{infoNode}</div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
