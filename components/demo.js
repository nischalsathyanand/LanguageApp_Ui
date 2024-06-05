import React from 'react';
import { Menu, Segment, Sidebar, Icon, Container, Header, Button } from 'semantic-ui-react';

const Demo = () => {
  const menuItems = [
    { name: 'Learn', icon: 'home' },
    { name: 'Letters', icon: 'font' },
    { name: 'Leaderboards', icon: 'trophy' },
    { name: 'Quests', icon: 'flag' },
    { name: 'Shop', icon: 'shop' },
    { name: 'Profile', icon: 'user' },
    { name: 'More', icon: 'ellipsis horizontal' },
  ];

  return (
    <div style={{ height: '100vh' }}>
      <Sidebar.Pushable as={Segment}>
        <Sidebar
          as={Menu}
          animation='push'
          icon='labeled'
          vertical
          visible
          width='thin'
        >
          <Menu.Item>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#58cc02' }}>
              Lantoon
            </div>
          </Menu.Item>
          {menuItems.map(item => (
            <Menu.Item key={item.name} as='a'>
              <Icon name={item.icon} />
              {item.name}
            </Menu.Item>
          ))}
        </Sidebar>

        <Sidebar.Pusher>
          <Segment basic>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Header as='h2' style={{ color: '#58cc02' }}>Section 1, Unit 1</Header>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon name='bell' size='large' style={{ marginRight: '20px' }} />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Icon name='user circle' size='large' />
                  <div style={{ marginLeft: '10px' }}>Username</div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '20px', background: '#f7f7f7', padding: '20px', borderRadius: '8px' }}>
              <Header as='h3' style={{ color: '#58cc02' }}>Pair letters and sounds</Header>
              <Button color='green' size='large' style={{ marginTop: '10px' }}>Start</Button>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                <Icon name='star outline' size='huge' style={{ marginBottom: '20px', color: '#ccc' }} />
                <Icon name='star outline' size='huge' style={{ marginBottom: '20px', color: '#ccc' }} />
                <Icon name='star outline' size='huge' style={{ marginBottom: '20px', color: '#ccc' }} />
                <Icon name='lock' size='huge' style={{ marginBottom: '20px', color: '#ccc' }} />
                <Icon name='trophy' size='huge' style={{ marginBottom: '20px', color: '#ccc' }} />
              </div>
            </div>
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  );
};

export default Demo;
