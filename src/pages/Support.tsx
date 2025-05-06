import React from 'react';
import '../styles/supporters.css';

const Support: React.FC = () => {
  return (
    <div className="support-container" style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
    }}>
      <h1 style={{
        textAlign: 'center',
        marginBottom: '40px',
        fontSize: '2rem',
        color: '#333',
      }}>银泰城GIAOT杯-第二赛季-通行证</h1>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '40px',
        flexWrap: 'wrap',
      }}>
        {/* 白银会员卡片 */}
        <div style={{
          flex: '1',
          minWidth: '300px',
          maxWidth: '400px',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
          textAlign: 'center',
        }}>
          <h2 className="supporter-silver" style={{
            marginBottom: '20px',
            fontSize: '1.5rem',
          }}>经典白银会员</h2>
          <div style={{
            fontSize: '2rem',
            marginBottom: '20px',
            color: '#333',
          }}>¥10</div>
          <p style={{
            marginBottom: '20px',
            color: '#666',
          }}>专属白银名称显示</p>
          <p style={{
            marginBottom: '20px',
            color: '#666',
          }}>更多福利解锁中...</p>
          <img 
            src="/images/commons/silver.png" 
            alt="白银会员收款码"
            style={{
              maxWidth: '200px',
              width: '100%',
              height: 'auto',
            }}
          />
        </div>

        {/* 黄金会员卡片 */}
        <div style={{
          flex: '1',
          minWidth: '300px',
          maxWidth: '400px',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
          textAlign: 'center',
        }}>
          <h2 className="supporter-golden" style={{
            marginBottom: '20px',
            fontSize: '1.5rem',
          }}>尊贵黄金会员</h2>
          <div style={{
            fontSize: '2rem',
            marginBottom: '20px',
            color: '#333',
          }}>¥50</div>
          <p style={{
            marginBottom: '20px',
            color: '#666',
          }}>专属黄金名称显示</p>
          <p style={{
            marginBottom: '20px',
            color: '#666',
          }}>更多福利解锁中...</p>
          <img 
            src="/images/commons/golden.png" 
            alt="黄金会员收款码"
            style={{
              maxWidth: '200px',
              width: '100%',
              height: 'auto',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Support; 