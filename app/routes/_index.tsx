import { json, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';
import { OpenCogPanel } from '~/components/opencog/OpenCogPanel';

export const meta: MetaFunction = () => {
  return [{ title: 'Bolt - OpenCog Edition' }, { name: 'description', content: 'Talk with Bolt, an AI assistant with OpenCog cognitive architecture from StackBlitz' }];
};

export const loader = () => json({});

export default function Index() {
  return (
    <div className="flex flex-col h-full w-full">
      <Header />
      <ClientOnly fallback={<BaseChat />}>{() => <Chat />}</ClientOnly>
      <ClientOnly fallback={null}>{() => <OpenCogPanel />}</ClientOnly>
    </div>
  );
}
